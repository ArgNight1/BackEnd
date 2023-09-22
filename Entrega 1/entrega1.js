console.log("cargo el .JS");

class ProductManager {
    constructor() {
        this.products = [];
        this.nextID = 1;
    }

    addProduct(productData) {

        const codeExists = this.products.some((product) => product.code === productData.code);

        if (codeExists) {
            console.log("Error: Este producto ya existe.");
            return;
        }

        const newProduct = {
            ID: this.nextID++,
            title: productData.title,
            descripcion: productData.descripcion,
            price: productData.price,
            thumbnail: productData.thumbnail,
            code: productData.code,
            stock: productData.stock,
        };

        this.products.push(newProduct);
        console.log("Producto agregado:");
        console.log(newProduct);
    }

    getProductById(id) {
        const product = this.products.find((product) => product.ID === id);

        if (product) {
            console.log("Producto encontrado:");
            console.log(product);
        } else {
            console.log("Error: No se encontró el producto con ID " + id);
        }
    }

    getProducts() {
        console.log("Lista de productos:");
        console.log(this.products);
    }
}

const productManager = new ProductManager();
const productData = {
    title: "producto de prueba",
    descripcion: "esto es un producto de prueba",
    price: 200,
    thumbnail: "imagen por ahora",
    code: "abc123",
    stock: 25,
};

const productData2 = {
    title: "Segundo producto de prueba",
    descripcion: "Esto es otro producto de prueba",
    price: 300,
    thumbnail: "otra imagen",
    code: "x",
    stock: 10,
};

/* Comandos para llamar a las funciones desde la consola */
// productManager.getProducts();
// productManager.addProduct(productData);
// productManager.addProduct(productData2);
// productManager.getProductById(1);
// productManager.getProductById(2);
