const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');


const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 8080;

const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');

app.use(express.json());
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

const productManager = new ProductManager('productos.json');
const cartManager = new CartManager('carts.json');

app.get('/api/products', (req, res) => {
    const { limit } = req.query;
    let productsToReturn = productManager.getProducts();
    if (limit) {
        const parsedLimit = parseInt(limit);
        if (!isNaN(parsedLimit)) {
            productsToReturn = productsToReturn.slice(0, parsedLimit);
        }
    }
    res.json(productsToReturn);
});
app.get('/api/products/:pid', (req, res) => {
    const { pid } = req.params;
    const product = productManager.getProductById(parseInt(pid));
    if (product) {
        res.json(product);
    } 
    else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});
app.post('/api/products', (req, res) => {
    const productData = req.body;
    productManager.addProduct(productData);
    res.status(201).json({ message: "Producto agregado con éxito" });
});
app.put('/api/products/:pid', (req, res) => {
    const { pid } = req.params;
    const productData = req.body;
    const updatedProduct = productManager.updateProduct(parseInt(pid), productData);
    if (updatedProduct) {
        res.json(updatedProduct);
    } 
    else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});
app.delete('/api/products/:pid', (req, res) => {
    const { pid } = req.params;
    const deletedProduct = productManager.deleteProduct(parseInt(pid));
    if (deletedProduct) {
        res.json(deletedProduct);
    } 
    else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});
app.post('/api/carts', (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
});
app.get('/api/carts/:cid', (req, res) => {
    const { cid } = req.params;
    const cart = cartManager.getCartById(cid);
    if (cart) {
        res.json(cart);
    } 
    else {
        res.status(404).json({ error: "Carrito no encontrado" });
    }
});
app.post('/api/carts/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity;
    const addedProduct = cartManager.addProductToCart(cid, pid, quantity);
    if (addedProduct) {
        res.status(201).json(addedProduct);
    } 
    else {
        res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
});
app.get('/', (req, res) => {
    res.send('¡Servidor en ejecución!');
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!! CHANN! ');
});
app.listen(port, () => {
    console.log(`Servidor Express en ejecución en el puerto ${port}`);
});
