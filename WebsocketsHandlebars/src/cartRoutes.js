const express = require('express');
const router = express.Router();
const CartManager = require('./CartManager');
const cartManager = new CartManager('carts.json');


router.get('/', (req, res) => {
    const carts = cartManager.getCarts();
    res.json(carts);
});

router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const cart = cartManager.getCartById(cid);
    if (cart) {
        res.json(cart);
    } 
    else {
        res.status(404).json({ error: "Carrito no encontrado" });
    }
});

router.post('/', (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
});

router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity || 1;
    const addedProduct = cartManager.addProductToCart(cid, pid, quantity);
    if (addedProduct) {
        res.status(201).json({ message: "Producto agregado al carrito correctamente", addedProduct });
    } 
    else {
        res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
});

module.exports = router;
