const express = require('express');
const router = express.Router();
const { enrollCourse, getMyEnrollments, updateProgress, submitAssignment } = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('student'), enrollCourse);
router.get('/my', protect, authorize('student'), getMyEnrollments);
router.put('/progress', protect, authorize('student'), updateProgress);
router.post('/assignment', protect, authorize('student'), submitAssignment);

module.exports = router;
