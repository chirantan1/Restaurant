const Food = require("../models/foodModel");
const Restaurant = require("../models/restaurantModel");
const mongoose = require("mongoose");

const createFoodController = async (req, res) => {
  try {
    const { title, description, price, image, restaurant, foodTags, code } =
      req.body;

    if (!title || !description || !price || !restaurant) {
      return res.status(400).send({
        success: false,
        message: "Title, description, price and restaurant are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(restaurant)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid restaurant id" });
    }

    const restaurantDoc = await Restaurant.findById(restaurant);
    if (!restaurantDoc) {
      return res
        .status(404)
        .send({ success: false, message: "Restaurant not found" });
    }

    if (
      req.user.userType !== "admin" &&
      restaurantDoc.owner?.toString() !== req.user.id
    ) {
      return res.status(403).send({
        success: false,
        message: "You can only add food to your own restaurant",
      });
    }

    const food = await Food.create({
      title,
      description,
      price,
      image,
      restaurant,
      foodTags,
      code,
    });

    res.status(201).send({
      success: true,
      message: "Food created successfully",
      food,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error creating food",
      error: error.message,
    });
  }
};

const getAllFoodsController = async (req, res) => {
  try {
    const filter = {};

    if (req.query.restaurant) filter.restaurant = req.query.restaurant;
    if (req.query.isAvailable !== undefined) {
      filter.isAvailable = req.query.isAvailable === "true";
    }
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }

    const foods = await Food.find(filter)
      .populate("restaurant", "title owner")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Foods fetched successfully",
      count: foods.length,
      foods,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching foods",
      error: error.message,
    });
  }
};

const getFoodByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid food id" });
    }

    const food = await Food.findById(id).populate("restaurant", "title owner");

    if (!food) {
      return res
        .status(404)
        .send({ success: false, message: "Food not found" });
    }

    res.status(200).send({
      success: true,
      message: "Food fetched successfully",
      food,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching food",
      error: error.message,
    });
  }
};

const getFoodsByRestaurantController = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid restaurant id" });
    }

    const foods = await Food.find({ restaurant: restaurantId }).sort({
      createdAt: -1,
    });

    res.status(200).send({
      success: true,
      message: "Foods fetched successfully",
      count: foods.length,
      foods,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching restaurant foods",
      error: error.message,
    });
  }
};

const updateFoodController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid food id" });
    }

    const food = await Food.findById(id).populate("restaurant", "owner");
    if (!food) {
      return res
        .status(404)
        .send({ success: false, message: "Food not found" });
    }

    if (
      req.user.userType !== "admin" &&
      food.restaurant?.owner?.toString() !== req.user.id
    ) {
      return res.status(403).send({
        success: false,
        message: "You can only modify food in your own restaurant",
      });
    }

    if (req.body.title !== undefined) food.title = req.body.title;
    if (req.body.description !== undefined)
      food.description = req.body.description;
    if (req.body.price !== undefined) food.price = req.body.price;
    if (req.body.image !== undefined) food.image = req.body.image;
    if (req.body.isAvailable !== undefined)
      food.isAvailable = req.body.isAvailable;
    if (req.body.rating !== undefined) food.rating = req.body.rating;
    if (req.body.foodTags !== undefined) food.foodTags = req.body.foodTags;
    if (req.body.code !== undefined) food.code = req.body.code;

    const updated = await food.save();

    res.status(200).send({
      success: true,
      message: "Food updated successfully",
      food: updated,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating food",
      error: error.message,
    });
  }
};

const deleteFoodController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid food id" });
    }

    const food = await Food.findById(id).populate("restaurant", "owner");
    if (!food) {
      return res
        .status(404)
        .send({ success: false, message: "Food not found" });
    }

    if (
      req.user.userType !== "admin" &&
      food.restaurant?.owner?.toString() !== req.user.id
    ) {
      return res.status(403).send({
        success: false,
        message: "You can only delete food from your own restaurant",
      });
    }

    await Food.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting food",
      error: error.message,
    });
  }
};

const rateFoodController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid food id" });
    }

    if (rating === undefined || rating < 0 || rating > 5) {
      return res.status(400).send({
        success: false,
        message: "Rating must be between 0 and 5",
      });
    }

    const food = await Food.findById(id);
    if (!food) {
      return res
        .status(404)
        .send({ success: false, message: "Food not found" });
    }

    food.rating = rating;
    await food.save();

    res.status(200).send({
      success: true,
      message: "Food rated successfully",
      food,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error rating food",
      error: error.message,
    });
  }
};

module.exports = {
  createFoodController,
  getAllFoodsController,
  getFoodByIdController,
  getFoodsByRestaurantController,
  updateFoodController,
  deleteFoodController,
  rateFoodController,
};
