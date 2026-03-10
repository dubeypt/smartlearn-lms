const express = require('express');
const router = express.Router();
const { getAnalytics, getAllUsers, toggleUserStatus, deleteUser, getAllCourses, updateCourseStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin')); // All admin routes protected

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/courses', getAllCourses);
router.put('/courses/:id/status', updateCourseStatus);

module.exports = router;
