const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const {
  getDashboardStatsController,
  getAllUsersAdminController,
  updateUserRoleController,
  blockUnblockUserController,
  verifyRestaurantController,
  getOrderStatsController,
} = require("../controllers/adminController");

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/dashboard", getDashboardStatsController);
router.get("/users", getAllUsersAdminController);
router.put("/users/:id/role", updateUserRoleController);
router.put("/users/:id/block", blockUnblockUserController);
router.put("/restaurants/:id/verify", verifyRestaurantController);
router.get("/orders/stats", getOrderStatsController);

module.exports = router;