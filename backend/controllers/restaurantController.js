const Restaurant = require("../models/restaurantModel");
const Food = require("../models/foodModel");
const mongoose = require("mongoose");

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

    if (!title || !foodType) {
      return res.status(400).send({
        success: false,
        message: "Title and food type are required",
      });
    }

    if (!Array.isArray(foodType)) {
      return res.status(400).send({
        success: false,
        message: "Food type must be an array",
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

    res.status(201).send({
      success: true,
      message: "Restaurant created successfully",
      restaurant: newRestaurant,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error creating restaurant",
      error: error.message,
    });
  }
};

const getAllRestaurantsController = async (req, res) => {
  try {
    const filter = {};

    if (req.user.userType === "vendor") {
      filter.owner = req.user.id;
    } else if (req.query.owner) {
      filter.owner = req.query.owner;
    }

    const restaurants = await Restaurant.find(filter)
      .populate("owner", "username email phoneNumber")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Restaurants fetched successfully",
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching restaurants",
      error: error.message,
    });
  }
};

const getMyRestaurantsController = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).send({
      success: true,
      message: "Your restaurants fetched successfully",
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching your restaurants",
      error: error.message,
    });
  }
};

const getRestaurantByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid restaurant id",
      });
    }

    const restaurant = await Restaurant.findById(id).populate(
      "owner",
      "username email phoneNumber"
    );

    if (!restaurant) {
      return res.status(404).send({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Restaurant fetched successfully",
      restaurant,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching restaurant",
      error: error.message,
    });
  }
};

const updateRestaurantController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid restaurant id",
      });
    }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).send({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (
      req.user.userType !== "admin" &&
      restaurant.owner?.toString() !== req.user.id
    ) {
      return res.status(403).send({
        success: false,
        message: "You can only modify your own restaurants",
      });
    }

    const updatedData = req.body;
    delete updatedData.owner;
    delete updatedData.isVerified;

    const updated = await Restaurant.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).send({
      success: true,
      message: "Restaurant updated successfully",
      restaurant: updated,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating restaurant",
      error: error.message,
    });
  }
};

const deleteRestaurantController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid restaurant id",
      });
    }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).send({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (
      req.user.userType !== "admin" &&
      restaurant.owner?.toString() !== req.user.id
    ) {
      return res.status(403).send({
        success: false,
        message: "You can only delete your own restaurants",
      });
    }

    await Food.deleteMany({ restaurant: id });
    await Restaurant.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Restaurant and its foods deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
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