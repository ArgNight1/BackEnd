const express = require('express');
const router = express.Router();
const ProductManager = require('./ProductManager');
const productManager = new ProductManager('productos.json');

router.get('/', (req, res) => {
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

router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const product = productManager.getProductById(parseInt(pid));
    if (product) {
        res.json(product);
    } 
    else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

router.post('/', (req, res) => {
    const productData = req.body;
    if (!productData || !productData.title || !productData.description || !productData.code || isNaN(productData.price) || isNaN(productData.stock)) {
        return res.status(400).json({ error: "Datos de producto no vslidos" });
    }
    productManager.addProduct(productData);
    res.status(201).json({ message: "Producto agregado correctamente" });
});


router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const productData = req.body;
    if (!productData || !productData.title || !productData.description || !productData.code || isNaN(productData.price) || isNaN(productData.stock)) {
        return res.status(400).json({ error: "Datos de producto no validos" });
    }
    const updatedProduct = productManager.updateProduct(parseInt(pid), productData);
    if (updatedProduct) {
        res.json(updatedProduct);
    }
    else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const deletedProduct = productManager.deleteProduct(parseInt(pid));
    if (deletedProduct) {
        res.json({ message: "Producto eliminado correctamente", deletedProduct });
    } 
    else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});
module.exports = router;
