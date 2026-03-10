// ============================================
// Controller: Reviews
// ============================================
const Review = require('../models/Review');
const Enrollment = require('../models/Enrollment');

// @desc   Get reviews for a course
// @route  GET /api/reviews/course/:courseId
// @access Public
exports.getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
      .populate('student', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Create review
// @route  POST /api/reviews
// @access Private (Student - must be enrolled)
exports.createReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;

    // Must be enrolled
    const enrolled = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrolled)
      return res.status(400).json({ success: false, message: 'You must be enrolled to review this course' });

    // Check for existing review
    const existing = await Review.findOne({ student: req.user._id, course: courseId });
    if (existing)
      return res.status(400).json({ success: false, message: 'You have already reviewed this course' });

    const review = await Review.create({ student: req.user._id, course: courseId, rating, comment });
    await review.populate('student', 'name avatar');

    res.status(201).json({ success: true, message: 'Review submitted!', review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc   Delete review (admin)
// @route  DELETE /api/reviews/:id
// @access Private (Admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
