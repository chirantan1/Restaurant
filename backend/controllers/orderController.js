const Order = require("../models/orderModel");
const Food = require("../models/foodModel");
const mongoose = require("mongoose");

// ==================== CREATE ORDER ====================
const createOrderController = async (req, res) => {
  try {
    const { restaurant, items, deliveryAddress, phone, paymentMethod, notes } =
      req.body;

    if (!restaurant || !items || !deliveryAddress || !phone) {
      return res.status(400).send({
        success: false,
        message: "restaurant, items, deliveryAddress and phone are required",
      });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .send({ success: false, message: "Order must have at least one item" });
    }
    if (!mongoose.Types.ObjectId.isValid(restaurant)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid restaurant id" });
    }

    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.food || !mongoose.Types.ObjectId.isValid(item.food)) {
        return res
          .status(400)
          .send({ success: false, message: "Invalid food id in items" });
      }
      const foodDoc = await Food.findById(item.food);
      if (!foodDoc) {
        return res
          .status(404)
          .send({ success: false, message: `Food not found: ${item.food}` });
      }
      const qty = Number(item.quantity) || 1;
      totalAmount += foodDoc.price * qty;
      validatedItems.push({
        food: foodDoc._id,
        quantity: qty,
        price: foodDoc.price,
      });
    }

    const order = await Order.create({
      buyer: req.user.id,
      restaurant,
      items: validatedItems,
      totalAmount,
      deliveryAddress,
      phone,
      paymentMethod: paymentMethod || "cash",
      notes: notes || "",
    });

    res
      .status(201)
      .send({ success: true, message: "Order created successfully", order });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

// ==================== GET ALL ORDERS (admin) ====================
const getAllOrdersController = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.restaurant) filter.restaurant = req.query.restaurant;
    if (req.query.buyer) filter.buyer = req.query.buyer;

    const orders = await Order.find(filter)
      .populate("buyer", "username email phoneNumber")
      .populate("restaurant", "title address")
      .populate("items.food", "title price image")
      .sort({ createdAt: -1 });

    res.status(200).send({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// ==================== GET ORDER BY ID ====================
const getOrderByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid order id" });
    }
    const order = await Order.findById(id)
      .populate("buyer", "username email phoneNumber address")
      .populate("restaurant", "title address phone")
      .populate("items.food", "title price image");
    if (!order) {
      return res
        .status(404)
        .send({ success: false, message: "Order not found" });
    }
    res.status(200).send({ success: true, order });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};

// ==================== GET MY ORDERS (buyer) ====================
const getMyOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate("restaurant", "title address")
      .populate("items.food", "title price image")
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching your orders",
      error: error.message,
    });
  }
};

// ==================== GET ORDERS BY RESTAURANT ====================
const getOrdersByRestaurantController = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid restaurant id" });
    }
    const orders = await Order.find({ restaurant: restaurantId })
      .populate("buyer", "username email phoneNumber")
      .populate("items.food", "title price image")
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching restaurant orders",
      error: error.message,
    });
  }
};

// ==================== GET VENDOR ORDERS (all restaurants owned by vendor) ====================
const getVendorOrdersController = async (req, res) => {
  try {
    const Restaurant = require("../models/restaurantModel");

    const myRestaurants = await Restaurant.find({ owner: req.user.id });
    const restaurantIds = myRestaurants.map((r) => r._id);

    const orders = await Order.find({ restaurant: { $in: restaurantIds } })
      .populate("buyer", "username email phoneNumber")
      .populate("restaurant", "title")
      .populate("items.food", "title price image")
      .sort({ createdAt: -1 });

    res.status(200).send({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching vendor orders",
      error: error.message,
    });
  }
};

// ==================== UPDATE ORDER STATUS ====================
const updateOrderStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid order id" });
    }
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .send({ success: false, message: "Order not found" });
    }
    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "delivering",
      "delivered",
      "cancelled",
    ];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).send({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }
    const validPayments = ["unpaid", "paid", "refunded"];
    if (paymentStatus && !validPayments.includes(paymentStatus)) {
      return res.status(400).send({
        success: false,
        message: `paymentStatus must be one of: ${validPayments.join(", ")}`,
      });
    }
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    const updated = await order.save();
    res.status(200).send({
      success: true,
      message: "Order updated successfully",
      order: updated,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating order",
      error: error.message,
    });
  }
};

// ==================== CANCEL ORDER ====================
const cancelOrderController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid order id" });
    }
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .send({ success: false, message: "Order not found" });
    }
    if (order.buyer.toString() !== req.user.id.toString()) {
      return res.status(403).send({
        success: false,
        message: "You can only cancel your own orders",
      });
    }
    if (["delivered", "cancelled"].includes(order.status)) {
      return res.status(400).send({
        success: false,
        message: `Cannot cancel an order that is already ${order.status}`,
      });
    }
    order.status = "cancelled";
    await order.save();
    res
      .status(200)
      .send({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
};

// ==================== DELETE ORDER ====================
const deleteOrderController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid order id" });
    }
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .send({ success: false, message: "Order not found" });
    }
    await Order.findByIdAndDelete(id);
    res
      .status(200)
      .send({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting order",
      error: error.message,
    });
  }
};

// ==================== EXPORTS ====================
module.exports = {
  createOrderController,
  getAllOrdersController,
  getOrderByIdController,
  getMyOrdersController,
  getOrdersByRestaurantController,
  getVendorOrdersController,
  updateOrderStatusController,
  cancelOrderController,
  deleteOrderController,
};
