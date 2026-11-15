const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createOrderController,
  getAllOrdersController,
  getOrderByIdController,
  getMyOrdersController,
  getOrdersByRestaurantController,
  getVendorOrdersController, // ← ADD THIS
  updateOrderStatusController,
  cancelOrderController,
  deleteOrderController,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/create", authMiddleware, createOrderController);
router.get("/getAll", authMiddleware, getAllOrdersController);
router.get("/getMyOrders", authMiddleware, getMyOrdersController);
router.get(
  "/getByRestaurant/:restaurantId",
  authMiddleware,
  getOrdersByRestaurantController,
);
router.get("/getById/:id", authMiddleware, getOrderByIdController);

router.get("/vendor-orders", authMiddleware, getVendorOrdersController);

router.put("/update/:id", authMiddleware, updateOrderStatusController);
router.put("/cancel/:id", authMiddleware, cancelOrderController);
router.put("/update-status/:id", authMiddleware, updateOrderStatusController);
router.delete("/delete/:id", authMiddleware, deleteOrderController);

module.exports = router;
