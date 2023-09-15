import { Router } from "express";
import CartManager from "../dao/managers/cartManager.js";

const cartsRouter = Router();
const CM = new CartManager();

//Solamente enviando POST a la raiz debe crear un carrito vacio
cartsRouter.post("/", async (req, res) => {
  const result = await CM.newCart();
  if (result) {
    //paso el id del carrito creado
    res.send({ status: "success", message: "Cart created successfully!", id: result._id});
  } else {
    res.status(500).send({
      status: "error",
      message: "Error! The Cart could not be created",
    });
  }
});

// get Cart por cid
cartsRouter.get("/:cid", async (req, res) => {
  const cid = req.params.cid;
  const cart = await CM.getCartById(cid);
  if (!cart) {
    res
      .status(400)
      .send({ status: "error", message: "The Cart does not exists" });
    return;
  }
  res.send({ products: cart.products });
});

//agrega productos al carrito seleccionado
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const cart = await CM.getCartById(cid);
  if (!cart) {
    res
      .status(400)
      .send({ status: "error", message: "The Cart does not exists" });
    return;
  }
  const result = await CM.addProductToCart(cid, pid);
  if (result) {
    res.send({
      status: "success",
      message: `Product ${pid} successfully added to Cart ${cid}`,
    });
  } else {
    res.status(500).send({
      status: "error",
      message: `Error! The product could not be added to the Cart ${cid}`,
    });
  }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const cart = await CM.getCartById(cid);
  if (!cart) {
    res
      .status(400)
      .send({ status: "error", message: "The Cart does not exists" });
    return;
  }
  const result = await CM.deleteProductFromCart(cid, pid);
  if (result) {
    res.send({
      status: "success",
      message: `Product ${pid} successfully deleted from Cart ${cid}`,
    });
  } else {
    res.status(500).send({
      status: "error",
      message: `Error! The product could not be deleted from the Cart ${cid}`,
    });
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  const cid = req.params.cid;
  const cart = await CM.getCartById(cid);
  if (!cart) {
    res
      .status(400)
      .send({ status: "error", message: "The Cart does not exists" });
    return;
  }
  const result = await CM.deleteCart(cid);
  if (result) {
    res.send({
      status: "success",
      message: `Cart ${cid} successfully deleted`,
    });
  } else {
    res.status(500).send({
      status: "error",
      message: `Error! The Cart ${cid} could not be deleted`,
    });
  }
});

cartsRouter.put("/:cid", async (req, res) => {
  const cid = req.params.cid;
  const cart = await CM.getCartById(cid);
  if (!cart) {
    res
      .status(400)
      .send({ status: "error", message: "The Cart does not exists" });
    return;
  }
  
  const result = await CM.updateCart(cid, req.body.products);
  if (result) {
    res.send({
      status: "success",
      message: `Cart ${cid} successfully updated`,
    });
  } else {
    res.status(500).send({
      status: "error",
      message: `Error! The Cart ${cid} could not be updated`,
    });
  }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const cart = await CM.getCartById(cid);
  if (!cart) {
    res
      .status(400)
      .send({ status: "error", message: "The Cart does not exists" });
    return;
  }
  const result = await CM.updateProductFromCart(cid, pid, req.body.quantity);
  if (result) {
    res.send({
      status: "success",
      message: `Product ${pid} successfully updated in Cart ${cid}`,
    });
  } else {
    res.status(500).send({
      status: "error",
      message: `Error! The product ${pid} could not be updated in the Cart ${cid}`,
    });
  }
});

export default cartsRouter;