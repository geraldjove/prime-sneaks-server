const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../auth");

const { verifyToken, verifyAdmin } = auth;

router.post("/", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/all", verifyToken, verifyAdmin, userController.getUsers);
router.get("/details", verifyToken, userController.getProfile);
router.put("/update", verifyToken, userController.updateUser);
router.put(
  "/update/:id",
  verifyToken,
  verifyAdmin,
  userController.adminUpdateUser
);
router.get("/:id", verifyToken, verifyAdmin, userController.getUser);
router.delete("/:id", verifyToken, userController.deleteUser);

module.exports = router;
