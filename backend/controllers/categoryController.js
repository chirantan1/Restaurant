const Category = require("../models/categoryModel");
const mongoose = require("mongoose");

const createCategoryController = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Category name is required",
      });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).send({
        success: false,
        message: "Category with this name already exists",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description,
      image,
    });

    res.status(201).send({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

const getAllCategoriesController = async (req, res) => {
  try {
    const filter = {};
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true";
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Categories fetched successfully",
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

const getCategoryByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid category id",
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching category",
      error: error.message,
    });
  }
};

const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid category id",
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    if (req.body.name !== undefined) category.name = req.body.name.trim();
    if (req.body.description !== undefined)
      category.description = req.body.description;
    if (req.body.image !== undefined) category.image = req.body.image;
    if (req.body.isActive !== undefined) category.isActive = req.body.isActive;

    const updated = await category.save();

    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category: updated,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid category id",
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting category",
      error: error.message,
    });
  }
};

module.exports = {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
};
