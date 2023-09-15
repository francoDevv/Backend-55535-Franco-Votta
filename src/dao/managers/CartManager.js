import { cartModel } from "../models/cart.js";

class CartManager {
  async newCart() {
    try {
      let cart = await cartModel.create({ products: [] });
      console.log("New Cart created successfully!");
      // return true;
      return cart;
    } catch (error) {
      console.log("Failed to create new cart");
      return false;
    }
  }
  //#Create
  async addProductToCart(cid, pid) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCartById(cid);
        const product = cart.products.find((item) => item.product._id.toString() === pid.toString());
        
        
        if (!cart) {
          //si no existe el carrito
          return false;
        }
        if (product) {
          //si el producto ya existe en el carrito seleccionado
          product.quantity += 1;
        } else {
          cart.products.push({ product: pid, quantity: 1 });
        } 
        

        await cartModel.updateOne({ _id: cid }, { products: cart.products });
        console.log("Cart updated!");
        return true; //respuesta para el endpoint
      } else {
        console.error(`The id: ${cid} or ${pid} is not a Mongo valid id`);
        return false;
      }
    } catch (error) {
      console.log("addProductToCart(cid,pid) Fail!");
      return false;
    }
  }
  //#Read
  async getCarts() {
    return await cartModel.find().lean();
  }

  async getCartById(id) {
    if (this.validateId(id)) {
      return (await cartModel.findOne({ _id: id }).lean()) || null;
    } else {
      console.log("Not found!");
      return null;
    }
  }

  //#Update
  async updateCart(id, cart) {
    try {
      if (this.validateId(id)) {
        await cartModel.updateMany({ _id: id }, { products: cart });
        console.log("Cart updated!");
        return true;
      } else {
        console.error(`The id: ${id} is not a Mongo valid id`);
        return false;
      }
    } catch (error) {
      console.log("Not found!");
      return false;
    }
  }

  async updateProductFromCart(cid, pid, quantity) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCartById(cid);
        if (!cart) {
          //si no existe el carrito
          return false;
        }
        const product = cart.products.find((prod) => prod.product === pid);
        if (!product) {
          //si no existe el producto
          return false;
        }
        product.quantity = quantity;
        await cartModel.updateOne({ _id: cid }, { products: cart.products });
        console.log("Product updated!");
        return true;
      } else {
        console.error(`The id: ${cid} or ${pid} is not a Mongo valid id`);
        return false;
      }
    } catch (error) {
      console.log("Not found!");
      return false;
    }
  }

  //#Delete
  async deleteProductFromCart(cid, pid) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCartById(cid);
        if (!cart) {
          //si no existe el carrito
          return false;
        }
        const product = cart.products.find((prod) => prod.product === pid);
        if (!product) {
          //si no existe el producto
          return false;
        }

        if (product.quantity > 1) {
          //si la cantidad es mayor a 1, le resto 1
          product.quantity -= 1;
          //actualizo la cantidad en el carrito
          await cartModel.updateOne({ _id: cid }, { products: cart.products });
        } else {
          //si la cantidad es 1, lo elimino del carrito finalmente con un FILTER
          cart.products = cart.products.filter((prod) => prod.product !== pid);
        }
        // Actualizo el carrito
        await cartModel.updateOne({ _id: cid }, { products: cart.products });
        console.log("Product delete");
        return true;
      } else {
        console.error(`The id: ${cid} or ${pid} is not a Mongo valid id`);
        return false;
      }
    } catch (error) {
      console.log("Not found!");
      return false;
    }
  }

  async deleteCart(id) {
    try {
      if (this.validateId(id)) {
        let result = await cartModel.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
          return false;
        }
        return true;
      } else {
        console.error(`The id: ${id} is not a Mongo valid id`);
        return false;
      }
    } catch (error) {
      console.log("Not found!");
      return false;
    }
  }

  //#Auxiliares
  validateId(id) {
    return id.length === 24 ? true : false; // 24 es la cantidad de caracteres que tiene un id de mongo, entonces valido esto para saber si es un id de mongo o no
  }
}

export default CartManager;