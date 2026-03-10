// ============================================
// Seed Data - Run: npm run seed
// ============================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartlearn';

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Course.deleteMany({});
  await Lecture.deleteMany({});

  // Create Users
  const adminUser = await User.create({
    name: 'Admin User', email: 'admin@smartlearn.com', password: 'admin123', role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', bio: 'Platform administrator',
  });

  const instructor1 = await User.create({
    name: 'Dr. Sarah Johnson', email: 'sarah@smartlearn.com', password: 'password123', role: 'instructor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', bio: 'Full Stack Developer with 10 years experience.',
  });

  const instructor2 = await User.create({
    name: 'Prof. Mike Chen', email: 'mike@smartlearn.com', password: 'password123', role: 'instructor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', bio: 'Data Science expert and university professor.',
  });

  const student1 = await User.create({
    name: 'Alice Smith', email: 'alice@smartlearn.com', password: 'password123', role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
  });

  const student2 = await User.create({
    name: 'Bob Williams', email: 'bob@smartlearn.com', password: 'password123', role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
  });

  // Create Courses
  const course1 = await Course.create({
    title: 'Complete React.js Developer Course 2024',
    description: 'Master React.js from scratch! Learn hooks, context API, Redux, React Router and build real-world projects. This comprehensive course takes you from beginner to advanced React developer.',
    instructor: instructor1._id,
    category: 'Web Development',
    level: 'Beginner',
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    status: 'approved',
    isPublished: true,
    duration: '24 hours',
    enrollmentCount: 342,
    averageRating: 4.8,
    totalRatings: 89,
    tags: ['React', 'JavaScript', 'Frontend'],
    requirements: ['Basic JavaScript knowledge', 'HTML & CSS fundamentals'],
    whatYouLearn: ['Build React apps from scratch', 'Use React Hooks', 'State management with Redux', 'API integration'],
  });

  const course2 = await Course.create({
    title: 'Python for Data Science & Machine Learning',
    description: 'Dive into the world of data science with Python! Learn NumPy, Pandas, Matplotlib, Seaborn, Scikit-Learn and more. Build ML models and analyze real datasets.',
    instructor: instructor2._id,
    category: 'Data Science',
    level: 'Intermediate',
    price: 499,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    status: 'approved',
    isPublished: true,
    duration: '32 hours',
    enrollmentCount: 218,
    averageRating: 4.6,
    totalRatings: 67,
    tags: ['Python', 'Machine Learning', 'Data Science'],
    requirements: ['Basic Python', 'High school math'],
    whatYouLearn: ['Data analysis with Pandas', 'ML algorithms', 'Data visualization', 'Model deployment'],
  });

  const course3 = await Course.create({
    title: 'Node.js & Express.js Backend Development',
    description: 'Build robust, scalable backends with Node.js and Express. Learn REST APIs, authentication, databases, and deployment. Complete backend mastery course.',
    instructor: instructor1._id,
    category: 'Web Development',
    level: 'Intermediate',
    price: 299,
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
    status: 'approved',
    isPublished: true,
    duration: '18 hours',
    enrollmentCount: 156,
    averageRating: 4.7,
    totalRatings: 43,
    tags: ['Node.js', 'Express', 'Backend', 'API'],
    requirements: ['JavaScript fundamentals'],
    whatYouLearn: ['REST API design', 'JWT Authentication', 'MongoDB with Mongoose', 'Deployment to cloud'],
  });

  const course4 = await Course.create({
    title: 'AWS Cloud Practitioner Essentials',
    description: 'Get certified with AWS! Learn cloud computing fundamentals, AWS services, security, and architecture best practices. Perfect for beginners entering cloud computing.',
    instructor: instructor2._id,
    category: 'Cloud Computing',
    level: 'Beginner',
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    status: 'pending',
    isPublished: false,
    duration: '15 hours',
    enrollmentCount: 0,
    tags: ['AWS', 'Cloud', 'DevOps'],
  });

  // Create Lectures for course1
  const lectures = [
    { title: 'Introduction to React', description: 'What is React and why use it', course: course1._id, videoUrl: 'https://www.youtube.com/embed/Tn6-PIqc4UM', duration: 15, order: 1, isFree: true },
    { title: 'Setting Up Your Environment', description: 'Install Node.js, VS Code and create-react-app', course: course1._id, videoUrl: 'https://www.youtube.com/embed/QFaFIcGhPoM', duration: 20, order: 2, isFree: true },
    { title: 'JSX and Components', description: 'Understanding JSX syntax and creating components', course: course1._id, videoUrl: 'https://www.youtube.com/embed/9U3IhLAnSxM', duration: 35, order: 3, isFree: false },
    { title: 'Props and State', description: 'Passing data with props and managing state', course: course1._id, videoUrl: 'https://www.youtube.com/embed/4ORZ1GmjaMc', duration: 40, order: 4, isFree: false, quiz: [{ question: 'What is the purpose of props in React?', options: ['Styling', 'Passing data to child components', 'Database queries', 'Server communication'], correctAnswer: 1 }] },
    { title: 'React Hooks - useState', description: 'Deep dive into the useState hook', course: course1._id, videoUrl: 'https://www.youtube.com/embed/O6P86uwfdR0', duration: 30, order: 5, isFree: false },
    { title: 'React Hooks - useEffect', description: 'Side effects with useEffect', course: course1._id, videoUrl: 'https://www.youtube.com/embed/0ZJgIjIuY7U', duration: 35, order: 6, isFree: false },
  ];

  await Lecture.insertMany(lectures);

  console.log('\n✅ Seed data created successfully!\n');
  console.log('📧 Login credentials:');
  console.log('   Admin:      admin@smartlearn.com   / admin123');
  console.log('   Instructor: sarah@smartlearn.com   / password123');
  console.log('   Instructor: mike@smartlearn.com    / password123');
  console.log('   Student:    alice@smartlearn.com   / password123');
  console.log('   Student:    bob@smartlearn.com     / password123\n');

  mongoose.disconnect();
};

seed().catch((err) => { console.error(err); mongoose.disconnect(); });
