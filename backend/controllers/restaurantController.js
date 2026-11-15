const Restaurant = require("../models/restaurantModel");
const Food = require("../models/foodModel");
const mongoose = require("mongoose");

// CREATE RESTAURANT
const createRestaurantController = async (req, res) => {
  try {
    const {
      title,
      image,
      foodType,
      pickup,
      delivery,
      isopen,
      logo,
      rating,
      ratingcount,
      coordinates,
    } = req.body;

    if (!title || !Array.isArray(foodType) || foodType.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title and food type array are required",
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const newRestaurant = new Restaurant({
      title,
      image,
      foodType,
      pickup,
      delivery,
      isopen,
      logo,
      rating,
      ratingcount,
      coordinates,
      owner: req.user.id,
      isVerified: req.user.userType === "admin",
    });

    await newRestaurant.save();

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant: newRestaurant,
    });
  } catch (error) {
    console.error("Create restaurant error:", error);

    return res.status(500).json({
      success: false,
      message: "Error creating restaurant",
      error: error.message,
    });
  }
};

// GET ALL RESTAURANTS
const getAllRestaurantsController = async (req, res) => {
  try {
    const filter = {};

    // If a vendor is logged in, show only their restaurants.
    // Public visitors can see all restaurants.
    if (req.user?.userType === "vendor") {
      filter.owner = req.user.id;
    } else if (req.query.owner) {
      if (!mongoose.Types.ObjectId.isValid(req.query.owner)) {
        return res.status(400).json({
          success: false,
          message: "Invalid owner ID",
        });
      }

      filter.owner = req.query.owner;
    }

    const restaurants = await Restaurant.find(filter)
      .populate("owner", "username email phoneNumber")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Restaurants fetched successfully",
      count: restaurants.length,
      restaurants: restaurants,
    });
  } catch (error) {
    console.error("Get all restaurants error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching restaurants",
      error: error.message,
    });
  }
};

// GET MY RESTAURANTS
const getMyRestaurantsController = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const restaurants = await Restaurant.find({
      owner: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Your restaurants fetched successfully",
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.error("Get my restaurants error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching your restaurants",
      error: error.message,
    });
  }
};

// GET RESTAURANT BY ID
const getRestaurantByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    const restaurant = await Restaurant.findById(id).populate(
      "owner",
      "username email phoneNumber",
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant fetched successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Get restaurant by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching restaurant",
      error: error.message,
    });
  }
};

// UPDATE RESTAURANT
const updateRestaurantController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (
      req.user.userType !== "admin" &&
      restaurant.owner?.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only modify your own restaurants",
      });
    }

    const updatedData = { ...req.body };

    // Prevent changing protected fields.
    delete updatedData.owner;
    delete updatedData.isVerified;

    const updated = await Restaurant.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant: updated,
    });
  } catch (error) {
    console.error("Update restaurant error:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating restaurant",
      error: error.message,
    });
  }
};

// DELETE RESTAURANT
const deleteRestaurantController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (
      req.user.userType !== "admin" &&
      restaurant.owner?.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own restaurants",
      });
    }

    await Food.deleteMany({ restaurant: id });
    await Restaurant.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Restaurant and its foods deleted successfully",
    });
  } catch (error) {
    console.error("Delete restaurant error:", error);

    return res.status(500).json({
      success: false,
      message: "Error deleting restaurant",
      error: error.message,
    });
  }
};

module.exports = {
  createRestaurantController,
  getAllRestaurantsController,
  getMyRestaurantsController,
  getRestaurantByIdController,
  updateRestaurantController,
  deleteRestaurantController,
};
