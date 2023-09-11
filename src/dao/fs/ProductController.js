import ProductManager from '../Manager/ProductManager.js';
import { socketServer } from '../app.js';

// Obtener todos los productos o los productos limitados.
export const getProductsRouter = async (req, res) => {
	const { limit } = req.query;

	try {
		const products = new ProductManager();
		await products.initialize();

		// Obtener el producto
		const getProducts = await products.getProducts();
		// Obtener el parámetro "limit" de la consulta
		if (limit > 0 && limit < getProducts.length) {
			// Si se proporciona el parámetro "limit", devolver solo los primeros productos según el límite especificado
			const limitedProducts = getProducts.slice(0, limit);
			return res.status(200).send(limitedProducts);
		}
		// Si no se proporciona el parámetro "limit", devolver todos los productos
		res.status(200).send(getProducts);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// Obtener un producto por su ID
export const getProductByIdRouter = async (req, res) => {
	try {
		const { id } = req.params;
		const products = new ProductManager();
		await products.initialize();

		const getProductById = await products.getProductsById(parseInt(id));
		if (!getProductById) {
			return res.status(404).send({ error: 'product not found' });
		}
		res.status(200).send(getProductById);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
};

export const postProductRouter = async (req, res) => {
	try {
		const { title, description, code, price, stock, category, thumbnail } =
			req.body;
		const products = new ProductManager();
		await products.initialize();
		const exist = await products.getProducts();

		if (exist.some((item) => item.code === code)) {
			return res.status(400).send({ error: err.message });
		}
		//campos obligatorios
		if (!title || !description || !code || !price || !stock || !category) {
			return res.status(400).send({ error: 'Faltan completar datos' });
		}
		//thumbnails es un array
		if (thumbnail && !Array.isArray(thumbnail)) {
			return res.send({ error: 'El campo de imágenes debe ser un array' });
		}
		//thumbnail es obligatoria
		if ((thumbnail && thumbnail.length === 0) || thumbnail === '') {
			return res.send({ error: 'Falta ingresar una o más imágenes' });
		}

		const newProduct = {
			title,
			description,
			code,
			price,
			stock,
			category,
			thumbnail,
		};

		newProduct.status = true;

		await products.addProduct(newProduct);
		socketServer.emit('productosupdated', await products.getProducts());
		res.status(200).send(newProduct);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
};

export const putProductRouter = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, code, price, stock, category, thumbnail } =
			req.body;
		const products = new ProductManager();
		await products.initialize();

		const getProductById = await products.getProductsById(parseInt(id));

		if (!getProductById) {
			return res.status(404).send({ error: 'producto no encontrado' });
		}

		if (!title || !description || !code || !price || !stock || !category) {
			return res.status(400).send({ error: 'Faltan completar datos' });
		}

		const updateProduct = {
			title,
			description,
			code,
			price,
			stock,
			category,
			thumbnail,
		};

		updateProduct.status = true;

		const updatedProduct = await products.updateProduct(
			parseInt(id),
			updateProduct
		);

		res.status(200).send(updatedProduct);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
};

export const deleteProductRouter = async (req, res) => {
	try {
		const { id } = req.params;
		const products = new ProductManager();
		await products.initialize();

		const getProductById = await products.getProductsById(parseInt(id));

		if (!getProductById) {
			return res.status(404).send({ error: 'producto no encontrado' });
		}

		await products.deleteProduct(parseInt(id));

		res.status(200).send({ success: 'Producto eliminado', getProductById });
		socketServer.emit('productosupdated', await products.getProducts());
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
};