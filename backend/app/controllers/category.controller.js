/**
 * Category Controller
 * Handles category-related requests and responses
 */

const ApiError = require("../api-error");
const categoryService = require("../services/category.service");

// Create category
const createCategory = async (req, res, next) => {
  if (!req.body) {
    return next(new ApiError(400, "Content can not be empty!"));
  }
  try {
    const { name } = req.body;
    const response = await categoryService.createCategory({ name });
    return res.status(201).json({
      message: "Category created successfully",
      data: response,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

// Get all categories
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

// Get category by name
const getCategoryByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const category = await categoryService.getCategoryByName(name);
    return res.status(200).json({
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

// Get category by ID
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    return res.status(200).json({
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

// Update category by ID
const updateCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const category = await categoryService.updateCategoryById(id, updateData);
    return res.status(200).json({
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

// Delete category by ID
const deleteCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.deleteCategoryById(id);
    return res.status(200).json({
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryByName,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
