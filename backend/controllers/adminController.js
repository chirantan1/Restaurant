const User = require("../models/userModel");
const Restaurant = require("../models/restaurantModel");
const Category = require("../models/categoryModel");
const Food = require("../models/foodModel");
const Order = require("../models/orderModel");
const mongoose = require("mongoose");

const getDashboardStatsController = async (req, res) => {
  try {
    const [users, restaurants, categories, foods, orders] = await Promise.all([
      User.countDocuments(),
      Restaurant.countDocuments(),
      Category.countDocuments(),
      Food.countDocuments(),
      Order.countDocuments(),
    ]);

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).send({
      success: true,
      message: "Dashboard stats fetched successfully",
      stats: {
        users,
        restaurants,
        categories,
        foods,
        orders,
        totalRevenue,
        ordersByStatus,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

const getAllUsersAdminController = async (req, res) => {
  try {
    const filter = {};
    if (req.query.userType) filter.userType = req.query.userType;

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

const updateUserRoleController = async (req, res) => {
  try {
    const { id } = req.params;
    const { userType } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid user id" });
    }

    const allowedRoles = ["client", "admin", "vendor", "delivery"];
    if (!userType || !allowedRoles.includes(userType)) {
      return res.status(400).send({
        success: false,
        message: `userType must be one of: ${allowedRoles.join(", ")}`,
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    user.userType = userType;
    await user.save();

    res.status(200).send({
      success: true,
      message: `User role updated to ${userType}`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating user role",
      error: error.message,
    });
  }
};

const blockUnblockUserController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid user id" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).send({
      success: true,
      message: user.isBlocked ? "User blocked" : "User unblocked",
      user: {
        _id: user._id,
        username: user.username,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error blocking/unblocking user",
      error: error.message,
    });
  }
};

const verifyRestaurantController = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid restaurant id" });
    }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res
        .status(404)
        .send({ success: false, message: "Restaurant not found" });
    }

    restaurant.isVerified = Boolean(isVerified);
    await restaurant.save();

    res.status(200).send({
      success: true,
      message: `Restaurant ${isVerified ? "verified" : "unverified"}`,
      restaurant,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error verifying restaurant",
      error: error.message,
    });
  }
};

const getOrderStatsController = async (req, res) => {
  try {
    const total = await Order.countDocuments();
    const byStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const byPayment = await Order.aggregate([
      { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    res.status(200).send({
      success: true,
      stats: { total, todayOrders, byStatus, byPayment },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching order stats",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStatsController,
  getAllUsersAdminController,
  updateUserRoleController,
  blockUnblockUserController,
  verifyRestaurantController,
  getOrderStatsController,
};
