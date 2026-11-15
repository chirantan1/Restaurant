const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const {
  createRestaurantController,
  getAllRestaurantsController,
  getMyRestaurantsController,
  getRestaurantByIdController,
  updateRestaurantController,
  deleteRestaurantController,
} = require("../controllers/restaurantController");

const router = express.Router();

router.get("/getall", getAllRestaurantsController);
router.get("/getbyid/:id", getRestaurantByIdController);

router.post("/create", authMiddleware, createRestaurantController);
router.get("/getmyrestaurants", authMiddleware, getMyRestaurantsController);
router.put("/update/:id", authMiddleware, updateRestaurantController);
router.delete("/delete/:id", authMiddleware, deleteRestaurantController);

module.exports = router;
