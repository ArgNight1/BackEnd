const express = require('express');
const fs = require('fs/promises'); 
const app = express();
const port = 8080; 

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            console.log("Productos cargados desde el archivo.");
        } catch (error) {
            this.products = [];
            console.log("No se encontró un archivo existente, se carga con una lista vacía.");
        }
    }

    async saveProducts() {
        const data = JSON.stringify(this.products, null, 2);
        await fs.writeFile(this.path, data, 'utf-8');
        console.log("Productos guardados en el archivo.");
    }

    addProduct(productData) {
        const unIdMas = this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) + 1 : 1;

        const newProduct = {
            id: unIdMas,
            title: productData.title,
            description: productData.description,
            price: productData.price,
            thumbnail: productData.thumbnail,
            code: productData.code,
            stock: productData.stock,
        };

        this.products.push(newProduct);
        this.saveProducts();
        console.log("Producto agregado:");
        console.log(newProduct);
    }

    getProducts() {
        console.log("Lista de productos:");
        console.log(this.products);
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        return product;
    }

}

const productManager = new ProductManager('productos.json');

app.use(express.json());
app.get('/products', async (req, res) => {
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

app.get('/products/:pid', (req, res) => {
    const { pid } = req.params;
    const product = productManager.getProductById(parseInt(pid));
    if (product) {
        res.json(product);
    } 
    else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

app.listen(port, () => {
    console.log(`Servidor Express en ejecución en el puerto ${port}`);
});
