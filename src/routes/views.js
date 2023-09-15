import e, { Router } from "express";
import ProductManager from "../dao/managers/productManager.js";
import CartManager from "../dao/managers/cartManager.js";

const router = Router();
const PM = new ProductManager();
const CM = new CartManager();

router.get("/", async (req, res) => {
  const products = await PM.getProducts(req.query);
  res.render("home", { products, title: "Home" });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { title: "Real Time Products" });
});

router.get("/chat", (req, res) => {
  res.render("chat", { title: "Chat" });
});

router.get("/products", async (req, res) => {
  const products = await PM.getProducts(req.query);
  res.render("products", { products, title: "Products" });
});

router.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await PM.getProductById(pid);
  res.render("productDetail", { product });
});

router.get("/carts/:cid", async (req, res) => {
  const cid = req.params.cid;
  const cart = await CM.getCartById(cid);
 
  res.render("cart", { cart }); 
});

export default router;