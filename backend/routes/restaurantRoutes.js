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

router.post("/create", authMiddleware, createRestaurantController);
router.get("/getall", authMiddleware, getAllRestaurantsController);
router.get("/getmyrestaurants", authMiddleware, getMyRestaurantsController);
router.get("/getbyid/:id", authMiddleware, getRestaurantByIdController);
router.put("/update/:id", authMiddleware, updateRestaurantController);
router.delete("/delete/:id", authMiddleware, deleteRestaurantController);

module.exports = router;
