import express  from "express";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname + 'public'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', async (req, res) => {
    await res.send('Server ON');
});

const server = app.listen(8080, () => {
    console.log('Server ON');
});

/*
app.get('/products', async (req, res) => {
    try {
        const productos = await utilidades.readFile('products.json');
        const limit= req.query.limit;
        if (limit) {
            const productosLimitados = productos.slice(0, limit);
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
import express  from "express";
import utilidades from "./utilidades.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
        await res.send('Servidor ON');
});

app.get('/products', async (req, res) => {
    try {
        const productos = await utilidades.readFile('products.json');
        const limit= req.query.limit;
        if (limit) {
            const productosLimitados = productos.slice(0, limit);
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
*/