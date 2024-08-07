const Order = require("../models/Order");
const User = require("../models/User");
const Cart = require("../models/Cart");

module.exports.getAllOrders = async (req, res) => {
  try {
    const response = await Order.find();
    if (response) {
      res.send({ ok: response });
    } else {
      res.send({ message: "Error looking for orders" });
    }
  } catch (error) {
    res.send({ message: error });
  }
};

module.exports.getUserOrder = async (req, res) => {
  try {
    const orderResponse = await Order.findOne({ userId: req.user.id });

    if (orderResponse) {
      res.send({ ok: orderResponse });
    } else {
      res.send({ message: "No orders available" });
    }
  } catch (error) {
    res.send({ message: error });
  }
};

module.exports.createOrder = async (req, res) => {
  try {
    const cartResponse = await Cart.findOne({ userId: req.user.id });

    if (cartResponse && cartResponse.cartItems.length > 0) {
      const newOrder = new Order({
        userId: req.user.id,
        productsOrdered: cartResponse.cartItems,
        totalPrice: cartResponse.totalPrice,
      });

      const saveOrder = await newOrder.save();

      if (saveOrder) {
        await Cart.deleteOne({ userId: req.user.id });
        res.send({ ok: saveOrder });
      } else {
        res.send({ message: "Error saving order" });
      }
    } else {
      res.send({ message: "Error making cart" });
    }
  } catch (error) {
    res.send({ message: error });
  }
};

module.exports.updateOrder = async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      { _id: req.params.id },
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    const saveUpdatedOrder = await updateOrder.save();

    if (saveUpdatedOrder) {
      res.send({ ok: saveUpdatedOrder });
    } else {
      res.send({ message: "Error saving updated order" });
    }
  } catch (error) {
    res.send({ message: "Error " + error });
  }
};

module.exports.deleteOrder = async (req, res) => {
  const removeOrder = await Order.findOneAndDelete({ _id: req.params.id });

  if (removeOrder) {
    res.send({ ok: removeOrder });
  } else {
    res.send({ message: "error deleting order" });
  }
};
