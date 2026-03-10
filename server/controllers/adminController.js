// ============================================
// Controller: Admin
// ============================================
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');

// @desc   Get analytics dashboard data
// @route  GET /api/admin/analytics
// @access Private (Admin)
exports.getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalEnrollments, totalReviews,
           pendingCourses, students, instructors] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Review.countDocuments(),
      Course.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'instructor' }),
    ]);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');
    const recentCourses = await Course.find().sort({ createdAt: -1 }).limit(5).populate('instructor', 'name');
    const topCourses = await Course.find({ status: 'approved' })
      .sort({ enrollmentCount: -1 }).limit(5).populate('instructor', 'name');

    res.json({
      success: true,
      analytics: {
        totalUsers, totalCourses, totalEnrollments, totalReviews,
        pendingCourses, students, instructors,
        recentUsers, recentCourses, topCourses,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get all users
// @route  GET /api/admin/users
// @access Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Toggle user active status
// @route  PUT /api/admin/users/:id/toggle
// @access Private (Admin)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Delete user
// @route  DELETE /api/admin/users/:id
// @access Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get all courses (admin)
// @route  GET /api/admin/courses
// @access Private (Admin)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Approve or reject course
// @route  PUT /api/admin/courses/:id/status
// @access Private (Admin)
exports.updateCourseStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' | 'rejected'
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { status, isPublished: status === 'approved' },
      { new: true }
    ).populate('instructor', 'name');

    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, message: `Course ${status}`, course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
