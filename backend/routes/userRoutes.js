const express = require("express");
const { getuserController } = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const { updateUserController } = require("../controllers/userControllers");
const { changePasswordWithOtp } = require("../controllers/userControllers");
const { requestPasswordOtp } = require("../controllers/userControllers");
const { deleteUserController } = require("../controllers/userControllers");

const router = express.Router();

router.get("/getUser", authMiddleware, getuserController);
router.put("/updateUser", authMiddleware, updateUserController);
router.post("/request-password-otp", authMiddleware, requestPasswordOtp);
router.post("/change-password-with-otp", authMiddleware, changePasswordWithOtp);
router.delete("/deleteUser/:id", authMiddleware, deleteUserController);

module.exports = router;
