import {Router} from 'express';
import utils from '../utils.js';

const router = Router();

const cart = [];

router.get('/', async (req, res) => {
    await res.send('Servidor ON from carts');
});

router.post('/', async (req, res) => {
    try {
        const order = await req.body;
        const cartList = await utils.readFile('carrito.json');
        const newCart = 
            {
                id: cartList.length + 1,
                products: [],
            }
        cartList.push(newCart);
        await utils.writeFile('carrito.json', cartList);
        await res.send(newCart);
    } catch (error) {
        console.error(error, 'Error en la ruta api/carts/post');
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const id = +req.params.cid;
        const cartList = await utils.readFile('carrito.json');
        const cart = cartList.find((cart) => cart.id === +req.params.cid);
        if (cart) {
            await res.send(cart);
        } else {
            await res.send('No existe el carrito');
        }
    } catch (error) {
        console.error(error, 'Error en la ruta api/carts/:cid');
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    // try{
    //     const cartId = await req.params.cid;
    //     const productId = await req.params.pid;
    //     const cartList = await utils.readFile('carrito.json');
    //     const cart = cartList.find((cart) => cart.id === +req.params.cid);
    //     const newProductCart = {
    //         id: +req.params.pid,
    //         quantity: +1,
    //     }
    //     cart.products.push(newProductCart);
    //     await utils.writeFile('carrito.json', cart);
    //     await res.send(cart);
    // } catch (error) {
    //     console.error(error, 'Error en la ruta api/carts/:cid/product/:pid');
    // }
    try {
        const cartId = await req.params.cid;
        const productId = await req.params.pid;
        const {id, quantity} = await req.body;
        const cartList = await utils.readFile('carrito.json');
        const cart = cartList.find((cartId) => cartId === +req.params.cid);
        const newProductCart = {
            id: +req.params.pid,
            quantity: +1,
        }
        cart.push(newProductCart);
        await utils.writeFile('carrito.json', cart);
        await res.send(cart);
    } catch (error) {
        console.error(error, 'Error en la ruta /carts/:cid/product/:pid');
    }
});

export default router;

/*
        const cart= await req.body;
        cart.push(product);
        await res.send(cart);
*/