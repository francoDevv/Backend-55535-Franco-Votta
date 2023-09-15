import { productModel } from "../models/product.js";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 8080;

class ProductManager {
  //#Create
  async addProduct(product) {
    try {
      if (await this.validateCode(product.code)) {
        //si el codigo existe
        console.error(`Error: product code "${code}" already exists`);
        return false;
      } else {
        await productModel.create(product);
        console.log("Product added successfully!");
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  //#Read
  async getProducts(params) {
    let { limit, page, query, sort } = params;
    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;
    sort = sort ? sort == "asc" ? 1 : -1 : 0;// 0 = no sort, 1 = asc, -1 = desc

  //recibo querys de la forma ?query=category:Papelería y la convierto en un objeto de la forma {category: "Papelería"}
    if (query) {
      query = query.split(":");
      query = { [query[0]]: query[1] };
    }else{
      query = {};
    }
    
    let products = await productModel.paginate(query, {limit:limit, page:page, sort:{price:sort},lean:true});//lean:true para que devuelva un objeto plano y no un documento de mongoose
    
    let status = products  ? "success" : "error";

    let prevLink = products.hasPrevPage ? `http://localhost:${port}/products?limit=${limit}&page=${products.prevPage}`: null;
    let nextLink = products.hasNextPage ? `http://localhost:${port}/products?limit=${limit}&page=${products.nextPage}`: null;

    products = {status:status, payload:products.docs, totalPages:products.totalPages, prevPage:products.prevPage, nextPage:products.nextPage, page:products.page, hasPrevPage:products.hasPrevPage, hasNextPage:products.hasNextPage, prevLink:prevLink, nextLink:nextLink};

    return products;
  }

  async getProductById(id) {
    if (this.validateId(id)) {
      return (await productModel.findOne({ _id: id }).lean()) || null;
    } else {
      console.log("Not found!");

      return null;
    }
  }

  //#Update
  async updateProduct(id, product) {
    try {
      if (this.validateId(id)) {
        if (await this.getProductById(id)) {
          await productModel.updateOne({ _id: id }, product);
          console.log("Product updated!");
          return true;
        } else {
          console.error(`The product id: ${id} does not exist`);
          return false;
        }
      } else {
        console.error(`The id: ${id} is not a Mongo valid id`);
        return false;
      }
    } catch (error) {
      console.log("Not found!");

      return false;
    }
  }

  //#Delete
  async deleteProduct(id) {
    try {
      if (this.validateId(id)) {
        if (await this.getProductById(id)) {
          await productModel.deleteOne({ _id: id });
          console.log(`Product id: ${id} has been deleted`);

          return true;
        } else {
          console.error(`The product id: ${id} does not exist`);
          return false;
        }
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
  async validateCode(code) {
    return (await productModel.findOne({ code: code })) || false;
  }

  validateId(id) {
    return id.length === 24 ? true : false; // 24 es la cantidad de caracteres que tiene un id de mongo, entonces valido esto para saber si es un id de mongo o no
  }
}

export default ProductManager;