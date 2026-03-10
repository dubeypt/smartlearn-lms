// ============================================
// Model: Review
// ============================================
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  { timestamps: true }
);

// One review per student per course
reviewSchema.index({ student: 1, course: 1 }, { unique: true });

// Static method to update course average rating
reviewSchema.statics.calcAverageRating = async function (courseId) {
  const stats = await this.aggregate([
    { $match: { course: courseId } },
    { $group: { _id: '$course', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  const Course = require('./Course');
  if (stats.length > 0) {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      totalRatings: stats[0].count,
    });
  } else {
    await Course.findByIdAndUpdate(courseId, { averageRating: 0, totalRatings: 0 });
  }
};

// Recalculate after save
reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.course);
});

// Recalculate after delete
reviewSchema.post('remove', function () {
  this.constructor.calcAverageRating(this.course);
});

module.exports = mongoose.model('Review', reviewSchema);
