const express = require("express");
const {
  registerController,
  loginController,
} = require("../controllers/authControllers");
const {
  requestPasswordOtp,
  changePasswordWithOtp,
  deleteUserController,
} = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

// Public password reset — no auth required
router.post("/request-password-otp", requestPasswordOtp);
router.post("/change-password-with-otp", changePasswordWithOtp);

// Protected
router.delete("/deleteUser{/:id}", authMiddleware, deleteUserController);

module.exports = router;
