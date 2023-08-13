import {Router} from 'express';

const router = Router();

const cart = [];

router.get('/', async (req, res) => {
    await res.send('Servidor ON from carts');
});

export default router;