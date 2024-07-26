const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "Required a User ID"],
  },
  cartItems: {
    productId: {
      type: String,
      required: [true, "Required a product"],
      quantity: {
        type: Number,
        default: 0,
      },
      subTotal: {
        type: Number,
        required: [true, "Required a subtotal"],
      },
    },
  },
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
