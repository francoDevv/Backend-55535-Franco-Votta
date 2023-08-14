import {Router} from 'express';
import utils from '../utils.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const productsList = await utils.readFile('products.json');
        const limit = req.query.limit;
        if (limit) {
            const productsListLimited = productsList.slice(0, limit);
            res.json(productsListLimited);
        } else {
            res.json(productsList);
        }
    }catch (error) {
        console.error(error, 'Error en la ruta /api/products/');
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productsList = await utils.readFile('products.json');
        const id = +req.params.pid;
        const product = productsList.find((product) => product.id === +req.params.pid);
        if (product) {
            await res.send(product);
        } else {
            await res.send('No existe el producto');
        }
    } catch (error) {
        console.error(error, 'Error en la ruta api/products/:pid');
    }
});

router.post('/', async (req, res) => {
    try {
        const product = await req.body;
        const productsList = await utils.readFile('products.json');
        const newProduct = {
            id: productsList.length + 1,
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            status: true,
            stock: product.stock,
            category: product.category,
            thumbnail: product.thumbnail,
        };
        productsList.push(newProduct);
        await utils.writeFile('products.json', productsList);
        await res.send(newProduct);
    } catch (error) {
        console.error(error, 'Error en la ruta api/products/post');
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const id = +req.params.pid;
        const product = await req.body;
        const productsList = await utils.readFile('products.json');
        const productIndex = productsList.findIndex((product) => product.id === id);
        const productUpdated = {
            id: id,
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            status: true,
            stock: product.stock,
            category: product.category,
            thumbnail: product.thumbnail,
        }
        productsList[productIndex] = productUpdated;
        await utils.writeFile('products.json', productsList);
        await res.send(productUpdated);
    } catch(error) {
        console.error(error, 'Error en la ruta api/products/put');
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const id = +req.params.pid;
        const productsList = await utils.readFile('products.json');
        const productIndex = productsList.findIndex((product) => product.id === id);
        productsList.splice(productIndex, 1);
        await utils.writeFile('products.json', productsList);
        await res.send('Producto eliminado');
    } catch (error) {
        console.error(error, 'Error en la ruta api/products/delete');
    }
});

export default router;