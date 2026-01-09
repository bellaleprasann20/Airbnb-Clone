const propertyService = require('../services/property.service');
const User = require('../models/user.model'); // Ensure this path is correct

// 1. GET ALL PROPERTIES (Public)
exports.getProperties = async (req, res, next) => {
  try {
    const filters = req.query;
    const properties = await propertyService.searchProperties(filters);
    
    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

// 2. GET SINGLE PROPERTY (Public)
exports.getProperty = async (req, res, next) => {
  try {
    const property = await propertyService.getPropertyById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Property not found.`
      });
    }

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// 3. GET HOST'S OWN LISTINGS
exports.getMyProperties = async (req, res, next) => {
  try {
    const properties = await propertyService.getPropertiesByHost(req.user.id);
    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

// 4. CREATE PROPERTY (Host Only)
exports.createProperty = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image' });
    }

    const images = req.files.map(file => file.filename);

    const locationStr = req.body.location || "";
    const locationParts = locationStr.split(',').map(p => p.trim());
    
    const propertyData = {
      ...req.body,
      host: req.user.id,
      images: images,
      city: locationParts[0] || "Unknown City",
      country: locationParts[1] || "India",
      price: Number(req.body.price),
      maxGuests: Number(req.body.maxGuests || 2),
      bedrooms: Number(req.body.bedrooms || 1),
      beds: Number(req.body.beds || 1),
      bathrooms: Number(req.body.bathrooms || 1),
      location: {
        type: 'Point',
        coordinates: [0, 0]
      }
    };
    
    const property = await propertyService.createProperty(propertyData);
    
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// 5. UPDATE PROPERTY
exports.updateProperty = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.filename);
    }

    if (updateData.price) updateData.price = Number(updateData.price);

    const updatedProperty = await propertyService.updateProperty(
      req.params.id, 
      req.user.id, 
      updateData
    );
    
    if (!updatedProperty) {
      return res.status(404).json({ 
        success: false, 
        message: 'Property not found or unauthorized' 
      });
    }

    res.status(200).json({ success: true, data: updatedProperty });
  } catch (error) {
    next(error);
  }
};

// 6. DELETE PROPERTY
exports.deleteProperty = async (req, res, next) => {
  try {
    await propertyService.deleteProperty(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// 7. UPLOAD PROPERTY IMAGES (The missing function causing the crash)
exports.uploadPropertyImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload images' });
    }
    
    const imageUrls = req.files.map(file => file.filename);
    
    res.status(200).json({ success: true, data: imageUrls });
  } catch (error) {
    next(error);
  }
};

// 8. TOGGLE WISHLIST
exports.toggleWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const propertyId = req.params.id;
    const isWishlisted = user.wishlist.includes(propertyId);

    if (isWishlisted) {
      user.wishlist.pull(propertyId);
    } else {
      user.wishlist.push(propertyId);
    }

    await user.save();
    res.status(200).json({ success: true, data: user.wishlist });
  } catch (error) {
    next(error);
  }
};