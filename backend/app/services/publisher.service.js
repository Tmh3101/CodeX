/**
 * Publisher Service
 * This service handles operations such as creating publishers,
 * finding publishers by name, and syncing publishers
 * from the Book model to the Publisher model.
 */

const ApiError = require("../api-error");
const Publisher = require("../models/publisher.model");

/**
 * Create a publisher in the database
 * @param {Object} publisherName - The publisher data to create
 * @return {Promise<Object>} - The created publisher document
 */

const createPublisher = async (publisherData) => {
  try {
    // Validate publisherData is an object with a name property
    if (!publisherData.name) {
      throw new ApiError(400, "Publisher name is required");
    }

    const publisher = new Publisher(publisherData);
    return await publisher.save();
  } catch (error) {
    console.error("Error creating publisher:", error);
    throw new Error("Failed to create publisher");
  }
};

/**
 * Get all publishers from the database
 * @return {Promise<Array>} - An array of publisher documents
 */
const getAllPublishers = async () => {
  try {
    return await Publisher.find({});
  } catch (error) {
    console.error("Error fetching publishers:", error);
    throw new Error("Failed to fetch publishers");
  }
};

/**
 * Get publisher by Name
 * @param {String} publisherName - The name of the publisher to find
 * @return {Promise<Object|null>} - The found publisher document or null if not found
 */
const getPublisherByName = async (publisherName) => {
  try {
    const publisher = await Publisher.findOne({ name: publisherName });
    if (!publisher) {
      throw new ApiError(404, "Publisher not found");
    }
    return publisher;
  } catch (error) {
    console.error("Error finding publisher by name:", error);
    throw new Error("Failed to find publisher by name");
  }
};

/**
 * Get publisher by ID
 * @param {String} publisherId - The ID of the publisher to find
 * @return {Promise<Object|null>} - The found publisher document or null if not found
 */
const getPublisherById = async (publisherId) => {
  try {
    const publisher = await Publisher.findById(publisherId);
    if (!publisher) {
      throw new ApiError(404, "Publisher not found");
    }
    return publisher;
  } catch (error) {
    console.error("Error finding publisher by ID:", error);
    throw new Error("Failed to find publisher by ID");
  }
};

/**
 * Update publisher by ID
 * @param {String} publisherId - The ID of the publisher to update
 * @param {Object} updateData - The data to update the publisher with
 * @return {Promise<Object>} - The updated publisher document
 * @throws {ApiError} - If the publisher is not found or update fails
 */
const updatePublisherById = async (publisherId, updateData) => {
  try {
    const publisher = await Publisher.findByIdAndUpdate(
      publisherId,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the update against the schema
      }
    );
    if (!publisher) {
      throw new ApiError(404, "Publisher not found");
    }

    return publisher;
  } catch (error) {
    console.error("Error updating publisher by ID:", error);
    throw new Error("Failed to update publisher by ID");
  }
};

/**
 * Delete publisher by ID
 * @param {String} publisherId - The ID of the publisher to delete
 */
const deletePublisherById = async (publisherId) => {
  try {
    const publisher = await Publisher.findByIdAndDelete(publisherId);
    if (!publisher) {
      throw new ApiError(404, "Publisher not found");
    }
    return publisher;
  } catch (error) {
    console.error("Error deleting publisher by ID:", error);
    throw new Error("Failed to delete publisher by ID");
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
