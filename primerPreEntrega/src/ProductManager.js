const fs = require('fs/promises');

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
            code: productData.code,
            price: productData.price,
            status: productData.status !== undefined ? productData.status : true,
            stock: productData.stock,
            category: productData.category,
            thumbnails: productData.thumbnails || [],
        };

        this.products.push(newProduct);
        this.saveProducts();
        console.log("Producto agregado:");
        console.log(newProduct);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        return product;
    }

    updateProduct(id, productData) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            const updatedProduct = { ...this.products[productIndex], ...productData };
            this.products[productIndex] = updatedProduct;
            this.saveProducts();
            return updatedProduct;
        }
        return null;
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            const deletedProduct = this.products.splice(productIndex, 1)[0];
            this.saveProducts();
            return deletedProduct;
        }
        return null;
    }
}

module.exports = ProductManager;
