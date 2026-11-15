const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createFoodController,
  getAllFoodsController,
  getFoodByIdController,
  getFoodsByRestaurantController,
  updateFoodController,
  deleteFoodController,
  rateFoodController,
} = require("../controllers/foodController");

const router = express.Router();

router.post("/create", authMiddleware, createFoodController);
router.get("/getAll", getAllFoodsController);
router.get("/getById/:id", getFoodByIdController);
router.get("/getByRestaurant/:restaurantId", getFoodsByRestaurantController);
router.put("/update/:id", authMiddleware, updateFoodController);
router.delete("/delete/:id", authMiddleware, deleteFoodController);
router.post("/rate/:id", authMiddleware, rateFoodController);

module.exports = router;
