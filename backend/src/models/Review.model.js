const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property',
    required: true
  },
  guest: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    trim: true,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent user from submitting more than one review per property
ReviewSchema.index({ property: 1, guest: 1 }, { unique: true });

/**
 * Static method to calculate average rating
 */
ReviewSchema.statics.getAverageRating = async function(propertyId) {
  const stats = await this.aggregate([
    { $match: { property: propertyId } },
    {
      $group: {
        _id: '$property',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    if (stats.length > 0) {
      await this.model('Property').findByIdAndUpdate(propertyId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        totalReviews: stats[0].totalReviews
      });
    } else {
      await this.model('Property').findByIdAndUpdate(propertyId, {
        averageRating: 0,
        totalReviews: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.property);
});

// Call getAverageRating before remove
ReviewSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.property);
});

module.exports = mongoose.model('Review', ReviewSchema);