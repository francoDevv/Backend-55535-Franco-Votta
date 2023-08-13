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
    
});


export default router;