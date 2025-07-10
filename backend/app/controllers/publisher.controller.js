/**
 * Publisher Controller
 * Handles publisher-related requests and responses
 */

const ApiError = require("../api-error");
const publisherService = require("../services/publisher.service");

// Create publisher
const createPublisher = async (req, res, next) => {
  if (!req.body) {
    return next(new ApiError(400, "Content can not be empty!"));
  }
  try {
    const { name } = req.body;
    const response = await publisherService.createPublisher(name);
    return res.status(201).json({
      message: "Publisher created successfully",
      data: response,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

// Get all publishers
const getAllPublishers = async (req, res, next) => {
  try {
    const publishers = await publisherService.getAllPublishers();
    return res.status(200).json({
      message: "Publishers retrieved successfully",
      data: publishers,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

// Get publisher by name
const getPublisherByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const publisher = await publisherService.getPublisherByName(name);
    return res.status(200).json({
      message: "Publisher retrieved successfully",
      data: publisher,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

// Get publisher by ID
const getPublisherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const publisher = await publisherService.getPublisherById(id);
    return res.status(200).json({
      message: "Publisher retrieved successfully",
      data: publisher,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

// Update publisher by ID
const updatePublisherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const publisher = await publisherService.updatePublisherById(
      id,
      updateData
    );
    return res.status(200).json({
      message: "Publisher updated successfully",
      data: publisher,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

// Delete publisher by ID
const deletePublisherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const publisher = await publisherService.deletePublisherById(id);
    return res.status(200).json({
      message: "Publisher deleted successfully",
      data: publisher,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

module.exports = {
  createPublisher,
  getAllPublishers,
  getPublisherByName,
  getPublisherById,
  updatePublisherById,
  deletePublisherById,
};
