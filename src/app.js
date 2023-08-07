import express  from "express";
import utilidades from "../utilidades.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
        await res.send('Servidor ON');
});

app.get('/products', async (req, res) => {
    try {
        const productos = await utilidades.readFile('products.json');
        const limite= req.query.limite;
        if (limite) {
            const productosLimitados = productos.slice(0, limite);
            res.json(productosLimitados);
        } else {
            res.json(productos);
        }
    } catch (error) {
        console.log(error, 'Error en la ruta /products');
    }
})

app.get('/products/:pid', async (req, res) => {
    try {
        const productos = await utilidades.readFile('products.json');
        const id = +req.params.pid;
        const producto = productos.find((producto) => producto.id === +req.params.pid);
        if (producto) {
            await res.send(producto);
        } else {
            await res.send('No existe el producto');
        }
    } catch (error) {
        console.log(error, 'Error en la ruta /products/:pid');
    }
});

app.listen(8080, () => {
    console.log('Server started on port 8080');
});    