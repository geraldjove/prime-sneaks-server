const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();
const auth = require("../auth");
const multer = require("multer");
const path = require("path");

// Middleware for authentication and authorization
const { verifyToken, verifyAdmin } = auth;

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// Route for adding a new product (including image upload)
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  upload.single("image"), // Handle file upload
  productController.registerProduct // Controller for handling product creation
);

router.get("/", verifyToken, productController.getAllActive);
router.get("/all", verifyToken, verifyAdmin, productController.getAllProducts);
router.get("/:id", verifyToken, productController.getProduct);
router.put(
  "/update/:id",
  verifyToken,
  verifyAdmin,
  productController.updateProduct
);
router.delete(
  "/delete/:id",
  verifyToken,
  verifyAdmin,
  productController.deleteProduct
);

module.exports = router;
