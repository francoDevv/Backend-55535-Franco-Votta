import {Router} from 'express';
import utils from '../utils.js';

const router = Router();

const cart = [];

router.get('/', async (req, res) => {
     res.send('Servidor ON from carts');
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
        res.send(newCart);
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
         res.send(cart);
        } else {
             res.send('No existe el carrito');
        }
    } catch (error) {
        console.error(error, 'Error en la ruta api/carts/:cid');
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId =  +req.params.cid;
        const productId = +req.params.pid;
        const {quantity} = req.body;
        const cartList = await utils.readFile('carrito.json');
        const cartIndex = cartList.findIndex((cartItem) => cartItem.id === cartId); 
        if (cartIndex === -1) {
            res.status(404).send('Carrito no encontrado');
            return;
        }
        const cart = cartList[cartIndex];
    
        if (!cart || !cart.products) {
            res.status(404).send('Carrito no encontrado');
            return;
        }
    
        const existingProduct = cart.products.find((product) => product.id === productId);
    
        if(existingProduct){
            existingProduct.quantity += quantity;
        }else{
            const newProductCart = {
                id: productId,
                quantity: quantity,
            };
            cart.products.push(newProductCart)
        }
        await utils.writeFile('carrito.json', cartList);
        res.send(cart);
    } catch (error) {
        console.error(error, 'Error en la ruta /carts/:cid/product/:pid');
        res.status(500).send('Error en el servidor');
    }
});

export default router;