const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  session({
    secret: process.env.clientSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use("/public/images", express.static("public/images"));

mongoose.connect(process.env.MONGO_UI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("open", () => {
  console.log("Open to MongoDB");
});

mongoose.connection.on("disconnected", () => {
  mongoose.disconnect();
  console.log("Disconnected to MongoDB");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Listening to port ${process.env.PORT || port}`);
});

// Middlewares

app.use("/public", express.static("public"));

// Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);

module.exports = app;
