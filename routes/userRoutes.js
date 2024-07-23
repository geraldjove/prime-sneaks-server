const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../auth");

const { verifyToken, verifyAdmin } = auth;

router.post("/", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/all", verifyToken, verifyAdmin, userController.getUsers);
router.get("/details", verifyToken, userController.getUser);
router.delete("/:id", verifyToken, userController.deleteUser);
router.put("/update/:id", verifyToken, userController.updateUser);
router.put(
  "/:id/set-as-admin",
  verifyToken,
  verifyAdmin,
  userController.updateAdmin
);

module.exports = router;
