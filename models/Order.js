const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  // I will need the UserID, and CartId
  userId: {
    type: String,
    required: [true, "Required userId"],
  },
  productsOrdered: [
    {
      productId: {
        type: String,
        required: [true, "required product ID"],
      },
      quantity: {
        type: Number,
        required: [true, "required quantity"],
      },
      subTotal: {
        type: Number,
        required: [true, "requied subTotal"],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, "Required total price"],
  },
  orderedOn: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Processing for delivery",
  },
});

module.exports = mongoose.model("Order", orderSchema);
