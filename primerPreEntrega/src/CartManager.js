const fs = require('fs/promises');

class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.carts = [];
        this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
            console.log("Carritos cargados desde el archivo.");
        } catch (error) {
            this.carts = [];
            console.log("No se encontró un archivo existente, se carga con una lista vacía.");
        }
    }

    async saveCarts() {
        const data = JSON.stringify(this.carts, null, 2);
        await fs.writeFile(this.path, data, 'utf-8');
        console.log("Carritos guardados en el archivo.");
    }

    createCart() {
        const newCartId = this.generateUniqueCartId();
        const newCart = {
            id: newCartId,
            products: [],
        };

        this.carts.push(newCart);
        this.saveCarts();
        console.log("Carrito creado:");
        console.log(newCart);
        return newCart;
    }

    getCartById(cartId) {
        const cart = this.carts.find(cart => cart.id === cartId);
        return cart;
    }

    addProductToCart(cartId, productId, quantity) {
        const cart = this.getCartById(cartId);
        if (cart) {
            const productToAdd = { productId, quantity };
            const existingProductIndex = cart.products.findIndex(item => item.productId === productId);

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } 
            else {
                cart.products.push(productToAdd);
            }

            this.saveCarts();
            console.log(`Producto ${productId} agregado al carrito ${cartId} con cantidad ${quantity}.`);
            return productToAdd;
        } 
        else {
            console.log(`Carrito con ID ${cartId} no encontrado.`);
            return null;
        }
    }

    generateUniqueCartId() {
        let newId;
        do {
            newId = Math.random().toString(36).substr(2, 9);
        } while (this.carts.some(cart => cart.id === newId));
        return newId;
    }
}
module.exports = CartManager;
