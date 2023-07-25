class ProductManager { //Creamos la clase ProductManager
    products;
    lastId;

    constructor() {
        this.products = [];
        this.lastId = 0;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
       try {
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
        }

        this.lastId++;
        const newProduct = {
            id: this.lastId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
        this.products.push(newProduct);
        } catch (error) {
            console.log(error);
        } 
    }

    getProduct = () => {
        return this.products;
    }

    getProductById(id) {
		try {
			const productId = this.products.find((dato) => dato.id === id);

			if (productId !== undefined) {
				return productId;
			}
			throw new Error('No existe el producto solicitado');
		} catch (error) {
			console.log(error);
			return 'No existe el producto solicitado';
		}
    }
}

const productManager = new ProductManager();

console.log(productManager.getProduct()); // Llamamos al metodo getProducts que devuelve un array vacio

productManager.addProduct( // Agregamos un producto de prueba
    "producto de prueba", 
    "Este es un prodcuto de prueba", 
    200, 
    "Sin imagen", 
    "abc123", 
    25,
);

console.log(productManager.getProduct()); // Llamamos al metodo getProducts que devuelve un array con el producto de prueba

// productManager.addProduct( // Intentamos agregar un producto con el mismo codigo de un producto ya creado y nos devuelve un error
//     "producto de prueba", 
//     "Este es un prodcuto de prueba", 
//     200, 
//     "Sin imagen", 
//     "abc123", 
//     25,
// );

// console.log(productManager.getProduct()); // Llamamos al metodo getProducts para demostrar que el producto duplicado no se agrego

// productManager.addProduct( // Intentamos agregar un producto sin pasarle todos los parametros y nos devuelve un error
//     "producto de prueba numero 2",
//     "Este es un prodcuto de prueba numero 2",
//     "Sin imagen",
//     "abc1234",
//     20
// )

// console.log(productManager.getProduct()); 

productManager.addProduct( // Agregamos un segundo producto de prueba
    "producto de prueba numero 3",
    "Este es un prodcuto de prueba numero 3",
    300,
    "Sin imagen",
    "def456",
    30
) 

productManager.addProduct( // Agregamos un tercer producto de prueba
    "producto de prueba numero 4",
    "Este es un prodcuto de prueba numero 4",
    400,
    "Sin imagen",
    "ghi789",
    40
) 

// console.log(productManager.getProductById(1)); // Llamamos al metodo getProductById para obtener el producto del id indicado
// console.log(productManager.getProductById(2)); 
// console.log(productManager.getProductById(3)); 
// console.log(productManager.getProductById(4)); // Llamamos al metodo getProductById para obtener el producto del id indicado pero como no existe nos devuelve un error

console.log(productManager.getProduct()); // Checkeamos por ultima vez que todos los productos se hayan agregado correctamente