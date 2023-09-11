import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import utils from "./utils.js";
import path from 'path'

import cartsRouter from "./routes/carts.js";
import productsRouter from "./routes/products.js";
import viewsRouter from "./routes/views.js";

import { Server } from "socket.io";
import ProductManager from "./dao/managerMongo/productManager.js";
import ChatManager from "./dao/managerMongo/chatManager.js";

const app = express();
const port = 8080;

const PM = new ProductManager();
const CM = new ChatManager();

//#Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(utils.__dirname, 'views'));
app.set('view engine', 'handlebars');

//#Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(utils.__dirname, 'public')));

//#Routes
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//#MongoDB
mongoose.connect(
  'mongodb+srv://francoDevv:123456QWE@clustercursobackend.gu8vmf7.mongodb.net/ecommerce'
);

//levanto el servidor en el puerto indicado
const httpServer = app.listen(port, () =>
  console.log(`Server ON - http://localhost:${port}`)
);

const io = new Server(httpServer);
io.on("connection", async (socket) => {
  //#Real Time Products
  console.log("New connection");
  //obtengo todos los productos
  const products = await PM.getProducts();
  socket.emit("realTimeProducts", products);

  //Escucho evento newProduct
  socket.on("newProduct", async (data) => {
    const product = {
      title: data.title,
      description: data.description,
      code: data.code,
      price: data.price,
      status: true,
      stock: 10,
      category: "",
      thumbnails: data.thumbnails,
    };
    //creo el producto
    await PM.addProduct(product);
    //obtengo todos los productos nuevamente
    const products = await PM.getProducts();
    socket.emit("realTimeProducts", products);
  });

  //Escucho evento deleteProduct
  socket.on("deleteProduct", async (data) => {
    await PM.deleteProduct(data);
    //obtengo todos los productos nuevamente
    const products = await PM.getProducts();
    socket.emit("realTimeProducts", products);
  });

  //#Chat Ecommerce
  socket.on("newChatUser", (data) => {
    socket.broadcast.emit("newChatUser", data + " has joined the chat");
  });

  socket.on("newMessage", async (data) => {
    await CM.createMessage(data);
    const messages = await CM.getMessages();
    io.emit("messages", messages);
  });
});