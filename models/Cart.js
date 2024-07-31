const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "Required a User ID"],
  },
  cartItems: [
    {
      productId: {
        type: String,
        required: [true, "Required a product"],
      },
      productImage: {
        type: String,
        required: [true, "Required product image"],
      },
      name: {
        type: String,
        required: [true, "Required product name"],
      },
      quantity: {
        type: Number,
        required: [true, "Required a quantity"],
      },
      subTotal: {
        type: Number,
        required: [true, "Required a subtotal"],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, "Required a total price"],
  },
  orderedOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
