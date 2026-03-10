const express = require('express');
const router = express.Router();
const { getCourseReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.get('/course/:courseId', getCourseReviews);
router.post('/', protect, authorize('student'), createReview);
router.delete('/:id', protect, authorize('admin'), deleteReview);

module.exports = router;
