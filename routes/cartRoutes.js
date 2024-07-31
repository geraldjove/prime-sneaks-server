const express = require("express");
const cartController = require("../controllers/cartController");
const router = express.Router();
const auth = require("../auth");

const { verifyToken, verifyAdmin } = auth;

router.get("/", verifyToken, cartController.getUserCart);
router.get("/all", verifyToken, verifyAdmin, cartController.getUsersCart);
router.post("/add-to-cart", verifyToken, cartController.addToCart);
router.patch("/add-to-cart", verifyToken, cartController.updateCart);
router.delete("/delete", verifyToken, cartController.deleteCart);
router.delete("/delete/:id", verifyToken, cartController.deleteCartItem);

module.exports = router;
