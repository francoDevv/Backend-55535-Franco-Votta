import {Router} from 'express';

const router = Router();

const cart = [];

router.get('/', async (req, res) => {
    await res.send('Servidor ON from carts');
});

router.post('/', async (req, res) => {
    try {
        const order = await req.body;
        const newCart = {
            id: cart.length + 1,
            products: [],
        }
        cart.push(newCart);
    } catch (error) {
        console.error(error, 'Error en la ruta api/carts/post');
    }
});

export default router;

/*
        const cart= await req.body;
        cart.push(product);
        await res.send(cart);
*/