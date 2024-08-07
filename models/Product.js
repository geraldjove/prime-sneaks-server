const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  image: {
    type: String,
    default: null,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    required: [true, "Please enter a product name"],
  },
  description: {
    type: String,
    required: [true, "Please enter a product description"],
  },
  rating: [
    {
      type: Number,
      default: 0,
    },
  ],
  price: {
    type: Number,
    required: [true, "Please enter a price"],
    default: 0,
  },
  discountedPrice: {
    type: Number,
    default: 0,
  },
  size: [
    {
      type: Number,
      default: [],
    },
  ],
  color: [
    {
      type: String,
      default: [],
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  isSale: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
