// ============================================
// Controller: Enrollments
// ============================================
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc   Enroll in a course
// @route  POST /api/enrollments
// @access Private (Student)
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.status !== 'approved')
      return res.status(400).json({ success: false, message: 'Course is not available for enrollment' });

    const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (existing) return res.status(400).json({ success: false, message: 'Already enrolled in this course' });

    const enrollment = await Enrollment.create({ student: req.user._id, course: courseId });

    // Update course enrollment count and user enrolledCourses
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: courseId } });

    res.status(201).json({ success: true, message: 'Enrolled successfully!', enrollment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc   Get my enrollments
// @route  GET /api/enrollments/my
// @access Private (Student)
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({ path: 'course', populate: { path: 'instructor', select: 'name' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Update lecture progress
// @route  PUT /api/enrollments/progress
// @access Private (Student)
exports.updateProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrollment) return res.status(404).json({ success: false, message: 'Not enrolled' });

    // Add lecture to completed if not already there
    if (!enrollment.completedLectures.includes(lectureId)) {
      enrollment.completedLectures.push(lectureId);
    }

    // Calculate progress
    const { default: Lecture } = await import('../models/Lecture.js').catch(() => ({ default: require('../models/Lecture') }));
    const totalLectures = await require('../models/Lecture').countDocuments({ course: courseId });
    enrollment.progress = totalLectures > 0
      ? Math.round((enrollment.completedLectures.length / totalLectures) * 100)
      : 0;

    if (enrollment.progress === 100) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();
    }

    await enrollment.save();
    res.json({ success: true, progress: enrollment.progress, enrollment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc   Submit assignment
// @route  POST /api/enrollments/assignment
// @access Private (Student)
exports.submitAssignment = async (req, res) => {
  try {
    const { courseId, content } = req.body;
    const enrollment = await Enrollment.findOneAndUpdate(
      { student: req.user._id, course: courseId },
      { 'assignment.submitted': true, 'assignment.content': content, 'assignment.submittedAt': new Date() },
      { new: true }
    );
    if (!enrollment) return res.status(404).json({ success: false, message: 'Not enrolled' });
    res.json({ success: true, message: 'Assignment submitted!', enrollment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
