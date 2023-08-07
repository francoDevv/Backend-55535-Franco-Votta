import utilidades from './utilidades.js'; // Importamos el modulo utilidades

class ProductManager { //Creamos la clase ProductManager
    products;

    constructor(path) {
        this.products = [];
        this.lastId = 1;
        this.path = path;
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        if (
            title === undefined ||
			description === undefined ||
			price === undefined ||
			thumbnail === undefined ||
			code === undefined ||
			stock === undefined
        ) {
            throw new Error("Faltan datos");
        }

        const product = this.products.find((product) => product.code === code);

        if (product) {
            throw new Error("El producto ya existe");
        } else {
            const newProduct = {
                id: this.lastId++,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            };
            this.products.push(newProduct);

            try {
                await utilidades.writeFile(this.path, this.products);
            } catch (error) {
               throw new Error(error, "addProduct tiene un error");
            }
        }
    };

    async getProduct() {
        try {
            let data = await utilidades.readFile(this.path);
            return data?.length > 0 ? this.products : 'No hay productos cargados';
        } catch (error) {
            throw new Error(error, "getProduct tiene un error");
        }
    }

    async getProductById(id) {
		try {
			let dato = await utilidades.readFile(this.path);
            this.products = dato?.length > 0 ? dato : [];
            const product = this.products.find((product) => product.id === id);
			if (!product || product === undefined) { 
				throw new Error('No existe el producto');
			}
			return product;
		} catch (error) {
			console.log(error);
			throw error;
		}
    }

    async updateProduct(id, data) {
        try {
            let products = await utilidades.readFile(this.path);
            this.products = products?.length > 0 ? products : [];

            let productIndex = this.products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                throw new Error('No existe el producto');
            } else {
                this.products[productIndex] = { ...this.products[productIndex], ...data };
                await utilidades.writeFile(this.path, products);
                return {
                    mensaje : 'Producto actualizado',
                    producto : this.products[productIndex],
                }
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteProduct(id) {
        try {
            let products = await utilidades.readFile(this.path);
            this.products = products?.length > 0 ? products : [];

            let productIndex = this.products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                throw new Error('No existe el producto');
            } else {
                let product = this.products[productIndex];
                this.products.splice(productIndex, 1);
                await utilidades.writeFile(this.path, products);
                return {
                    mensaje : 'Producto eliminado',
                    producto : product,
                }
            }
        } catch (error) {
           throw new Error(error);
        }
    }

    async createFile() {
        try {
            await utilidades.writeFile(this.path, this.products);
        } catch (error) {
            throw new Error(error);
        }       
    }
}

const productManager = new ProductManager('products.json');

await productManager.createFile(); // Creamos el archivo json

// await productManager // todavia no hay registros de productos
//     .getProduct()
//     .then((products) => {
//         console.log(products);
//     })
//     .catch((error) => {
//         throw new Error(error, 'no se han podido traer los productos');
//     });

// await productManager.addProduct( // Agregamos productos de prueba
// 	'producto prueba 1',
// 	'Este es un producto prueba 1',
// 	100,
// 	'Sin imagen',
// 	'abc123',
// 	25
// );

// await productManager.addProduct(
// 	'producto prueba 2',
// 	'Este es un producto prueba 2',
// 	200,
// 	'Sin imagen',
// 	'def456',
// 	5
// );

// await productManager.addProduct(
//     'producto prueba 3',
//     'Este es un producto prueba 3',
//     300,
//     'Sin imagen',
//     'ghi789',
//     10
// );

// await productManager.addProduct(
//     'producto prueba 4',
//     'Este es un producto prueba 4',
//     400,
//     'Sin imagen',
//     'jkl101112',
//     15
// );

// await productManager // llamamos al metodo getProduct para ver los productos agregados
//     .getProduct()
//     .then((products) => {
//         console.log(products);
//     })
//     .catch((error) => {
//         throw new Error(error, 'no se han podido traer los productos de prueba');
//     });

// await productManager.addProduct(  // agregamos un producto con un codigo que ya existe
//     'producto duplicado',
//     'Este es un producto duplicado',
//     500,
//     'Sin imagen',
//     'abc12332432',
//     20
// );

// await productManager.addProduct( // agregamos un producto sin algunos datos
// 	'producto con falta de datos',
// 	150,
// 	'Sin imagen',
// 	'12345'
// );

// await productManager // llamamos al metodo getProductById para ver un producto en particular
// 	.getProductById(2)
// 	.then((product) => {
// 		console.log(product);
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});

//  await productManager
//     .getProductById(1)
//     .then((product) => {
//         console.log(product);
//     })
//     .catch((error) => {
//         console.log(error, 'no se ha podido traer el producto'); 
//     })


// const res = await productManager // llamamos al metodo updateProduct para actualizar un producto
//     .updateProduct(1, {price: 456, stock: 50})
// console.log(res);

// await productManager // llamamos al metodo getProductById para ver el producto actualizado
//     .getProductById(1)
//     .then((product) => {
//         console.log(product);
//     })
//     .catch((error) => {
//         console.log(error, 'no se ha podido traer el producto'); 
//     })

// await productManager // llamamos al metodo deleteProduct para eliminar un producto
//     .deleteProduct(1)
//     .then(data => {
//         console.log(data, `Eliminaste el producto : ${data.producto.title}')`);
//     })
//     .catch((error) => {
//         console.log(error, 'no se ha podido eliminar el producto');
//     })