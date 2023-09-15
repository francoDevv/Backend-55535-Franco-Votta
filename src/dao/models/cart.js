import mongoose from "mongoose";

const cartsCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId, //tipo de dato que me permite referenciar a otro documento y meter mas de 1 producto
        ref: "products",
      },
      quantity: Number,
    },
  ],
});

cartSchema.pre("findOne", function () {
  this.populate("products.product");
});

export const cartModel = mongoose.model(cartsCollection, cartSchema);