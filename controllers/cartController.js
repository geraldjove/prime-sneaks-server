const Cart = require("../models/Cart");
const Product = require("../models/Product");

module.exports.getUsersCart = async (req, res) => {
  try {
    const response = await Cart.find();

    if (response.length > 0) {
      res.send({ ok: response });
    } else if (response.length == 0) {
      res.send({ message: "No users cart available" });
    } else {
      res.send({ message: "Error getting users cart" });
    }
  } catch (error) {
    res.send({ message: "Error " + error });
  }
};

module.exports.getUserCart = async (req, res) => {
  try {
    const response = await Cart.findOne({ userId: req.user.id });
    res.send({ ok: response });
  } catch (error) {
    res.send({ message: "Error " + error });
  }
};

module.exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const userId = req.user.id;
    const fetchUserCart = await Cart.findOne({ userId });
    const fetchProduct = await Product.findById(productId);

    if (fetchUserCart) {
      // Check if the product already exists in the cart
      const existingCartItem = fetchUserCart.cartItems.find(
        (cart) => cart.productId == productId
      );

      if (existingCartItem) {
        // Update the quantity and subtotal of the existing product
        existingCartItem.quantity += Number(quantity);
        existingCartItem.subTotal =
          existingCartItem.quantity * fetchProduct.price;

        // Update the total price of the cart
        fetchUserCart.totalPrice += Number(quantity * fetchProduct.price);
      } else {
        // Add the new product to the cart
        fetchUserCart.cartItems.push({
          productId: req.body.productId,
          productImage: fetchProduct.image,
          name: fetchProduct.name,
          quantity: Number(quantity),
          subTotal: quantity * fetchProduct.price, // subTotal for each individual product item
        });
        fetchUserCart.totalPrice += Number(quantity * fetchProduct.price);
      }

      const updatedCart = await fetchUserCart.save();
      res.send({ ok: updatedCart });
    } else {
      // Create new cart if there are no carts available
      const newCart = new Cart({
        userId,
        cartItems: [
          {
            productId: req.body.productId,
            productImage: fetchProduct.image,
            name: fetchProduct.name,
            quantity: Number(quantity),
            subTotal: quantity * fetchProduct.price, // subTotal for each individual product item
          },
        ],
        totalPrice: Number(quantity * fetchProduct.price), // This is the total price of the whole cart
      });

      const saveCart = await newCart.save();
      res.send({ ok: saveCart });
    }
  } catch (error) {
    res.send({ message: "Error " + error });
  }
};

module.exports.updateCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const fetchUserCart = await Cart.findOne({ userId: req.user.id });
    const fetchProduct = await Product.findById(productId);

    if (fetchUserCart) {
      const foundProduct = fetchUserCart.cartItems.find(
        (cart) => cart.productId == productId
      );

      if (foundProduct) {
        foundProduct.quantity = quantity;
        foundProduct.subTotal = quantity * fetchProduct.price;

        // Recalculate the total price of the cart
        fetchUserCart.totalPrice = fetchUserCart.cartItems.reduce(
          (total, item) => total + item.subTotal,
          0
        );

        const saveCart = await fetchUserCart.save();

        if (saveCart) {
          res.send({ ok: saveCart });
        } else {
          res.send({ message: "Error saving cart" });
        }
      } else {
        res.send({ message: "Product is not included in the cart" });
      }
    } else {
      res.send({ message: "Cart not found" });
    }
  } catch (error) {
    res.send({ message: "Error " + error });
  }
};

module.exports.deleteCartItem = async (req, res) => {
  const productId = req.params.id;
  try {
    const response = await Cart.findOneAndUpdate(
      { "cartItems.productId": productId }, // Find document with cart item matching productId
      { $pull: { cartItems: { productId } } }, // Pull (remove) the item from cartItems array
      { new: true } // Return the updated document
    );
    console.log(response);

    if (!response) {
      return res.status(404).send({ message: "Cart item not found" });
    }

    res.send({ ok: true, message: "Cart item deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting cart item: " + error.message });
  }
};

module.exports.deleteCart = async (req, res) => {
  try {
    const response = await Cart.findOneAndDelete({ userId: req.user.id });
    res.send({ ok: response });
  } catch (error) {
    res.send({ message: "Error " + error });
  }
};
