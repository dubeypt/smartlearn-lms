// ============================================
// Controller: Courses
// ============================================
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const Enrollment = require('../models/Enrollment');

// @desc   Get all approved courses (with filters)
// @route  GET /api/courses
// @access Public
exports.getCourses = async (req, res) => {
  try {
    const { category, level, search, sort } = req.query;
    const query = { status: 'approved', isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) query.title = { $regex: search, $options: 'i' };

    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { averageRating: -1 };
    if (sort === 'popular') sortOption = { enrollmentCount: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .sort(sortOption);

    res.json({ success: true, count: courses.length, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get single course with lectures
// @route  GET /api/courses/:id
// @access Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio')
      .populate({ path: 'lectures', options: { sort: { order: 1 } } });

    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Create course
// @route  POST /api/courses
// @access Private (Instructor)
exports.createCourse = async (req, res) => {
  try {
    req.body.instructor = req.user._id;
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, message: 'Course created successfully', course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc   Update course
// @route  PUT /api/courses/:id
// @access Private (Instructor/Admin)
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    // Only instructor owner or admin can update
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc   Delete course
// @route  DELETE /api/courses/:id
// @access Private (Instructor/Admin)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await Lecture.deleteMany({ course: req.params.id });
    await Enrollment.deleteMany({ course: req.params.id });
    await course.deleteOne();

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get instructor's courses
// @route  GET /api/courses/instructor/my
// @access Private (Instructor)
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get students enrolled in instructor's course
// @route  GET /api/courses/:id/students
// @access Private (Instructor)
exports.getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const enrollments = await Enrollment.find({ course: req.params.id })
      .populate('student', 'name email avatar createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: enrollments.length, enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
