const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();
const auth = require("../auth");

const { verifyToken, verifyAdmin } = auth;

router.get("/", verifyToken, orderController.getUserOrder);
router.get("/all", verifyToken, verifyAdmin, orderController.getAllOrders);
router.post("/", verifyToken, orderController.createOrder);
router.put(
  "/update/:id",
  verifyToken,
  verifyAdmin,
  orderController.updateOrder
);
router.delete(
  "/delete/:id",
  verifyToken,
  verifyAdmin,
  orderController.deleteOrder
);

module.exports = router;
