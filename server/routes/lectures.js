// routes/lectures.js
const express = require('express');
const router = express.Router();
const { getCourseLectures, createLecture, updateLecture, deleteLecture } = require('../controllers/lectureController');
const { protect, authorize } = require('../middleware/auth');

router.get('/course/:courseId', getCourseLectures);
router.post('/', protect, authorize('instructor', 'admin'), createLecture);
router.put('/:id', protect, authorize('instructor', 'admin'), updateLecture);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteLecture);

module.exports = router;
