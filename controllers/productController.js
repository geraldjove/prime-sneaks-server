const Product = require("../models/Product.js");
const multer = require("multer");
const path = require("path");
// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a unique filename
  },
});
const upload = multer({ storage });

module.exports.registerProduct = async (req, res) => {
  try {
    const {
      imageUrl,
      name,
      description,
      rating,
      price,
      discountedPrice,
      size,
      color,
      isActive,
      isSale,
    } = req.body;

    const parseRating = rating.split(",").map(Number);
    const parseSize = size.split(",").map(Number);
    const parseColor = color.split(",").map(String);

    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      return res.status(400).send({ message: "Product is already registered" });
    }

    const imagePath = req.file ? req.file.path : null;

    const newProduct = new Product({
      image: imagePath,
      imageUrl,
      name,
      description,
      rating: Number(parseRating),
      price,
      discountedPrice,
      size: parseSize,
      color: parseColor,
      isActive,
      isSale,
    });

    const savedProduct = await newProduct.save();

    if (savedProduct) {
      res.status(201).send({
        ok: "Successfully registered product",
        product: savedProduct,
      });
    } else {
      res.status(500).send({ message: "Error creating product" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error" + error });
  }
};

module.exports.getAllProducts = async (req, res) => {
  try {
    const response = await Product.find();
    if (response) {
      res.send({ ok: response });
    } else {
      res.send({ message: "No products found" });
    }
  } catch (error) {
    res.send({ message: "Error fetching data ", error });
  }
};

module.exports.getAllActive = async (req, res) => {
  try {
    const response = await Product.find({ isActive: true });
    if (response) {
      res.send({ ok: response });
    } else {
      res.send({ message: "No active products" });
    }
  } catch (error) {
    res.send({ message: "Error fetching data ", error });
  }
};

module.exports.getProduct = async (req, res) => {
  const user = req.user;
  const isAdmin = user && user.isAdmin;

  try {
    const response = await Product.findById(req.params.id);
    if (response) {
      if (response.isActive || isAdmin) {
        res.send({ ok: response });
      } else {
        res.send({ message: "Product unavailable" });
      }
    } else {
      res.send({ message: "No product found" });
    }
  } catch (error) {
    res.send({ message: "Error fetching data " + error });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const {
      imageUrl,
      name,
      description,
      rating,
      price,
      discountedPrice,
      size,
      color,
      isActive,
      isSale,
    } = req.body;

    const parseRating = rating.split(",").map(Number);
    const parseSize = size.split(",").map(Number);
    const parseColor = color.split(",").map(String);

    const image = req.file ? req.file.path : req.body.image;

    const response = await Product.findByIdAndUpdate(
      req.params.id,
      {
        image,
        imageUrl,
        name,
        description,
        rating: Number(parseRating),
        price,
        discountedPrice,
        size: parseSize,
        color: parseColor,
        isActive,
        isSale,
      },
      {
        new: true,
      }
    );

    if (response) {
      res.send({ ok: response });
    } else {
      res.status(400).send({ message: "Error updating product" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching data" + error });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const response = await Product.findByIdAndDelete(req.params.id);
    if (response) {
      res.send({ ok: `Successfully Delete Product ${req.params.id}` });
    } else {
      res.send({
        message: "Error deleting product or product does not exists",
      });
    }
  } catch (error) {
    res.send({ message: "Error fetching data ", error });
  }
};
