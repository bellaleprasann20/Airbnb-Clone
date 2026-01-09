const Property = require('../models/Property.model'); // Double check if this is Property.model.js
const mongoose = require('mongoose');

/**
 * Searches properties based on filters (like category)
 */
const searchProperties = async (filters) => {
  const query = {};

  if (filters.category && filters.category !== 'All') {
    const categoryName = decodeURIComponent(filters.category);
    query.category = { $regex: new RegExp(`^${categoryName}$`, 'i') };
  }

  if (filters.city) {
    query.city = { $regex: new RegExp(filters.city, 'i') };
  }

  return await Property.find(query).sort({ createdAt: -1 });
};

/**
 * Gets a single property by its ID
 */
const getPropertyById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return await Property.findById(id).populate('host', 'name email avatar');
};

/**
 * Gets all properties owned by a specific host
 */
const getPropertiesByHost = async (hostId) => {
  return await Property.find({ host: hostId }).sort({ createdAt: -1 });
};

/**
 * Create a new property
 */
const createProperty = async (data) => {
  // Mongoose .create returns the saved document
  const property = await Property.create(data);
  return property;
};

/**
 * Update property with ownership check
 */
const updateProperty = async (propertyId, userId, updateData) => {
  const property = await Property.findById(propertyId);
  
  if (!property) return null;

  // SECURITY CHECK
  if (property.host.toString() !== userId.toString()) {
    throw new Error('Unauthorized: You can only edit your own listings');
  }

  return await Property.findByIdAndUpdate(propertyId, updateData, {
    new: true,
    runValidators: true
  });
};

/**
 * Delete property with ownership check
 */
const deleteProperty = async (propertyId, userId) => {
  const property = await Property.findById(propertyId);
  
  if (!property) return null;

  if (property.host.toString() !== userId.toString()) {
    throw new Error('Unauthorized: You can only delete your own listings');
  }

  return await Property.findByIdAndDelete(propertyId);
};

module.exports = {
  searchProperties,
  getPropertyById,
  getPropertiesByHost,
  createProperty,
  updateProperty,
  deleteProperty
};