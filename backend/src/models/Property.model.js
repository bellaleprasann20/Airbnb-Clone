const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a catchy title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  // ADDED CITY AND COUNTRY to match your Home.jsx
  city: { type: String, required: true },
  country: { type: String, required: true },
  
  address: {
    type: String,
    required: false // Changed to false for easier seeding
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], 
      default: [0, 0] // Default to 0,0 so it doesn't crash if missing
    }
  },
  category: {
    type: String,
    required: true,
    // UPDATED ENUMS to match your dummyData.js categories
    enum: ['Beachfront', 'Mountains', 'Camping', 'Tropical', 'Castles', 'Bed & Breakfasts', 'Iconic Cities', 'Arctic', 'Amazing pools']
  },
  propertyType: {
    type: String,
    enum: ['House', 'Apartment', 'Guest suite', 'Hotel', 'Villa', 'Cottage'],
    default: 'House'
  },
  // MATCHED price field name to your seed/frontend
  price: {
    type: Number,
    required: [true, 'Please add a nightly price']
  },
  amenities: [String],
  images: [{
    type: String, 
    required: true
  }],
  rating: { // Matched your frontend "rating" key
    type: Number,
    default: 4.5
  },
  maxGuests: { type: Number, default: 2 },
  bedrooms: Number,
  beds: Number,
  bathrooms: Number,
}, {
  timestamps: true
});

module.exports = mongoose.model('Property', PropertySchema);