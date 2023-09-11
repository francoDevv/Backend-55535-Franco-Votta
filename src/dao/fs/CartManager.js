import utils from '../utils.js';

class CartManager {
	constructor() {
		this.cart = [];
		this.path = './src/Json/carrito.json';
		this.id = 1;
	}
	//recorre los productos que existen en el json para evitar subidas duplicadas
	async initialize() {
		try {
			await utils.accessFile(this.path);

			const productsCartParse = await this.getCart();
			if (productsCartParse.length !== 0) {
				const productsCartParse = await this.getCart();
				this.cart = productsCartParse;
				CartManager.id = Math.max(...this.cart.map((item) => item.id)) + 1;
			}
		} catch (error) {
			// Si el archivo no existe, lo creo con un array vacío
			await this.createFile();
			throw new Error('Error al leer el archivo de productos' + error.message);
		}
	}

	async getCart() {
		try {
			const getCartParse = await utils.readFile(this.path);
			return getCartParse;
		} catch (error) {
			throw new Error('Error al obtener el carrito: ' + error.message);
		}
	}

	async newOrder() {
		try {
			const order = {
				id: CartManager.id++,
				products: [],
			};

			this.cart.push(order);
			await this.createFile();

			return order;
		} catch (error) {
			throw new Error('Error al crear una nueva orden: ' + error.message);
		}
	}

	async createFile() {
		try {
			await utils.writeFile(this.path, this.cart);
		} catch (error) {
			throw new Error(
				'Error al crear el archivo del carrito: ' + error.message
			);
		}
	}

	async getOrderById(id) {
		try {
			const readParse = await this.getCart();
			const getOrderById = readParse.find((item) => item.id === id);

			if (!getOrderById) {
				return undefined;
			}
			const products = getOrderById.products;
			return products;
		} catch (error) {
			throw new Error('Error al obtener la orden por ID: ' + error.message);
		}
	}

	async addProductToCart(cid, pid) {
		try {
			const order = this.cart.find((item) => item.id === cid);
			const exist = order.products.find((item) => item.id === pid);

			if (!exist) {
				order.products.push({ id: pid, quantity: 1 });
			} else {
				exist.quantity++;
			}

			await this.createFile();
		} catch (error) {
			throw new Error(
				'Error al agregar el producto al carrito: ' + error.message
			);
		}
	}
}

export default CartManager;