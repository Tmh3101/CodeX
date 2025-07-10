/**
 * Categories service
 * This service handles category-related operations such as creating and syncing categories
 * from the Book model to the Category model.
 */

const ApiError = require("../api-error");
const Category = require("../models/category.model");

/**
 * Create a category in the database
 * @param {Object} categoryName - The category data to create
 * @return {Promise<Object>} - The created category document
 *
 */
const createCategory = async (categoryName) => {
  try {
    const category = new Category(categoryName);
    return await category.save();
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
};

/**
 * Get all categories from the database
 * @return {Promise<Array>} - An array of category documents
 */
const getAllCategories = async () => {
  try {
    return await Category.find({});
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

/**
 * Get category by Name
 * @param {String} categoryName - The name of the category to find
 * @return {Promise<Object|null>} - The found category document or null if not found
 */
const getCategoryByName = async (categoryName) => {
  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
    return category;
  } catch (error) {
    console.error("Error finding category by name:", error);
    throw new Error("Failed to find category by name");
  }
};

/**
 * Get category by ID
 * @param {String} categoryId - The ID of the category to find
 * @return {Promise<Object|null>} - The found category document or null if not found
 */
const getCategoryById = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
    return category;
  } catch (error) {
    console.error("Error finding category by ID:", error);
    throw new Error("Failed to find category by ID");
  }
};

/**
 * Update category by ID
 * @param {String} categoryId - The ID of the category to update
 * @param {Object} updateData - The data to update the category with
 * @return {Promise<Object>} - The updated category document
 * @throws {ApiError} - If the category is not found or update fails
 */
const updateCategoryById = async (categoryId, updateData) => {
  try {
    const category = await Category.findByIdAndUpdate(categoryId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
    return category;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};

/**
 * Delete category by ID
 * @param {String} categoryId - The ID of the category to delete
 * @return {Promise<Object>} - The deleted category document
 * @throws {ApiError} - If the category is not found or deletion fails
 */
const deleteCategoryById = async (categoryId) => {
  try {
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
    return category;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
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
