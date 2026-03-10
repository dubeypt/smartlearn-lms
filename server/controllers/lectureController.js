// ============================================
// Controller: Lectures
// ============================================
const Lecture = require('../models/Lecture');
const Course = require('../models/Course');

// @desc   Get lectures for a course
// @route  GET /api/lectures/course/:courseId
// @access Public (free lectures) / Private (enrolled)
exports.getCourseLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ course: req.params.courseId }).sort({ order: 1 });
    res.json({ success: true, lectures });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Add lecture to course
// @route  POST /api/lectures
// @access Private (Instructor)
exports.createLecture = async (req, res) => {
  try {
    const course = await Course.findById(req.body.course);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    // Set order to next in sequence
    const count = await Lecture.countDocuments({ course: req.body.course });
    req.body.order = count + 1;

    const lecture = await Lecture.create(req.body);
    res.status(201).json({ success: true, lecture });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc   Update lecture
// @route  PUT /api/lectures/:id
// @access Private (Instructor)
exports.updateLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id).populate('course');
    if (!lecture) return res.status(404).json({ success: false, message: 'Lecture not found' });
    if (lecture.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const updated = await Lecture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, lecture: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc   Delete lecture
// @route  DELETE /api/lectures/:id
// @access Private (Instructor/Admin)
exports.deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id).populate('course');
    if (!lecture) return res.status(404).json({ success: false, message: 'Lecture not found' });
    if (lecture.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await lecture.deleteOne();
    res.json({ success: true, message: 'Lecture deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
