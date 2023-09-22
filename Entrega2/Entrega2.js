const fs = require('fs');

class ProductManager {
    //la ruta del archivo
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            this.products = JSON.parse(data);
            console.log("habia productos, los levanto desde el archivo.");
        } catch (error) {
            // verifico si esta o no.
            this.products = [];
            console.log("no habia archivo, se carga con lista vacia");
        }
    }


    saveProducts() {
        const data = JSON.stringify(this.products, null, 2);
        fs.writeFileSync(this.path, data, 'utf-8');
        console.log("Productos guardados");
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
        if (product) {
            console.log("Producto encontrado: ");
            console.log(product);
        } else {
            console.log("Error: No se encontró el producto con ID " + id);
        }
        return product;
    }

    updateProduct(id, updatedProductData) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProductData };
            this.saveProducts();
            console.log("Producto actualizado:");
            console.log(this.products[index]);
        } else {
            console.log("Error: No se encontró el producto con ID " + id);
        }
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1);
            this.saveProducts();
            console.log("Producto eliminado:");
            console.log(deletedProduct);
        } else {
            console.log("Error: No se encontró el producto con ID " + id);
        }
    }
}

const productManager = new ProductManager('productos.json');
const productData = {
    title: "producto de prueba",
    description: "esto es un producto de prueba",
    price: 200,
    thumbnail: "imagen por ahora",
    code: "abc123",
    stock: 25,
};

const productData2 = {
    title: "Segundo producto de prueba",
    description: "Esto es otro producto de prueba",
    price: 300,
    thumbnail: "otra imagen",
    code: "x",
    stock: 10,
};

const productData3 = {
    title: "un prd mas",
    description: "Esto otrooo",
    price: 3010,
    thumbnail: "imagen 2",
    code: "234",
    stock: 140,
};

//ABM

//alta
productManager.addProduct(productData);
productManager.addProduct(productData2);
productManager.addProduct(productData3);

const allProducts = productManager.getProducts();

//Modificacion 
const productToUpdate = productManager.getProductById(1);
if (productToUpdate) {
    productManager.updateProduct(1, { price: 250, stock: 380 });
}

//baja
productManager.deleteProduct(2);

