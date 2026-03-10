// ============================================
// Model: Lecture
// ============================================
const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lecture title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    videoUrl: {
      type: String,
      default: '', // YouTube URL or uploaded video path
    },
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    resources: [
      {
        name: String,
        url: String,
      },
    ],
    quiz: [
      {
        question: { type: String, required: true },
        options: [String],
        correctAnswer: { type: Number }, // index of correct option
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lecture', lectureSchema);
