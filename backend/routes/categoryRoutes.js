const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} = require("../controllers/categoryController");

const router = express.Router();

router.post("/create", authMiddleware, createCategoryController);
router.get("/getAll", getAllCategoriesController);
router.get("/getById/:id", getCategoryByIdController);
router.put("/update/:id", authMiddleware, updateCategoryController);
router.delete("/delete/:id", authMiddleware, deleteCategoryController);

module.exports = router;
