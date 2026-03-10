# 🎓 SmartLearn LMS

> A Full-Stack Learning Management System built with the **MERN Stack**  
> Final Year College Project | React.js + Node.js + Express.js + MongoDB

![SmartLearn Banner](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=300&fit=crop)

---

## 🚀 Features

### 👩‍🎓 Student
- Register / Login with JWT authentication
- Browse & search courses with filters
- Enroll in free and paid courses
- Watch video lectures (YouTube embed)
- Track course progress with visual progress bar
- Take quizzes with instant feedback
- Submit assignments to instructors
- Rate and review completed courses

### 👨‍🏫 Instructor
- Create courses with rich details
- Add video lectures with YouTube URLs
- Add multiple-choice quizzes to lectures
- View enrolled students and their progress
- Mark lectures as free preview

### ⚙️ Admin
- Full analytics dashboard
- Approve / reject instructor-submitted courses
- Manage all users (activate/deactivate/delete)
- View platform-wide statistics

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js 18, Tailwind CSS, React Router v6 |
| Backend    | Node.js, Express.js 4             |
| Database   | MongoDB, Mongoose ODM             |
| Auth       | JWT (JSON Web Tokens), bcryptjs   |
| HTTP       | Axios                             |
| Styling    | Tailwind CSS + Google Fonts       |

---

## 📁 Project Structure

```
smartlearn-lms/
├── package.json              ← Root (concurrent runner)
│
├── server/                   ← Backend (Node + Express)
│   ├── index.js              ← Entry point
│   ├── .env                  ← Environment variables
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Lecture.js
│   │   ├── Enrollment.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── lectures.js
│   │   ├── enrollments.js
│   │   ├── reviews.js
│   │   ├── users.js
│   │   └── admin.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── lectureController.js
│   │   ├── enrollmentController.js
│   │   ├── reviewController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js           ← JWT protect + role authorize
│   └── utils/
│       └── seedData.js       ← Sample data seeder
│
└── client/                   ← Frontend (React)
    ├── public/
    │   └── index.html
    ├── tailwind.config.js
    └── src/
        ├── App.jsx            ← Routes
        ├── index.js
        ├── index.css          ← Tailwind + custom styles
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   └── common/
        │       ├── Navbar.jsx
        │       ├── Footer.jsx
        │       └── CourseCard.jsx
        └── pages/
            ├── HomePage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── CoursesPage.jsx
            ├── CourseDetailPage.jsx
            ├── VideoLearningPage.jsx
            ├── StudentDashboard.jsx
            ├── InstructorDashboard.jsx
            ├── AdminDashboard.jsx
            └── ProfilePage.jsx
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### Step 1: Clone / Download the project
```bash
# If using git
git clone <your-repo-url>
cd smartlearn-lms
```

### Step 2: Install all dependencies
```bash
# Install root + server + client dependencies
npm run install-all
```

Or manually:
```bash
# Root
npm install

# Server
cd server
npm install

# Client
cd ../client
npm install
```

### Step 3: Configure environment
The `server/.env` file is already created with defaults:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartlearn
JWT_SECRET=smartlearn_jwt_secret_2024_college_project
JWT_EXPIRE=7d
NODE_ENV=development
```

> **MongoDB Atlas:** Replace `MONGO_URI` with your Atlas connection string if not running MongoDB locally.

### Step 4: Seed sample data
```bash
npm run seed
```

This creates:
- 3 sample courses (React, Python, Node.js)
- 5 users (admin, 2 instructors, 2 students)
- 6 lectures for the React course

### Step 5: Run the application
```bash
# Run both frontend + backend simultaneously
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 🔑 Demo Login Credentials

| Role       | Email                      | Password     |
|------------|----------------------------|--------------|
| Admin      | admin@smartlearn.com       | admin123     |
| Instructor | sarah@smartlearn.com       | password123  |
| Instructor | mike@smartlearn.com        | password123  |
| Student    | alice@smartlearn.com       | password123  |
| Student    | bob@smartlearn.com         | password123  |

> These are also available as quick-click demo buttons on the Login page!

---

## 📡 API Endpoints

### Auth
| Method | Endpoint              | Description          | Access  |
|--------|-----------------------|----------------------|---------|
| POST   | /api/auth/register    | Register user        | Public  |
| POST   | /api/auth/login       | Login user           | Public  |
| GET    | /api/auth/me          | Get current user     | Private |
| PUT    | /api/auth/profile     | Update profile       | Private |
| PUT    | /api/auth/password    | Change password      | Private |

### Courses
| Method | Endpoint                     | Description              | Access         |
|--------|------------------------------|--------------------------|----------------|
| GET    | /api/courses                 | Get all approved courses | Public         |
| GET    | /api/courses/:id             | Get single course        | Public         |
| POST   | /api/courses                 | Create course            | Instructor     |
| PUT    | /api/courses/:id             | Update course            | Instructor     |
| DELETE | /api/courses/:id             | Delete course            | Instructor/Admin |
| GET    | /api/courses/instructor/my   | Get my courses           | Instructor     |
| GET    | /api/courses/:id/students    | Get enrolled students    | Instructor     |

### Enrollments
| Method | Endpoint                    | Description             | Access  |
|--------|-----------------------------|-------------------------|---------|
| POST   | /api/enrollments            | Enroll in course        | Student |
| GET    | /api/enrollments/my         | Get my enrollments      | Student |
| PUT    | /api/enrollments/progress   | Update lecture progress | Student |
| POST   | /api/enrollments/assignment | Submit assignment       | Student |

### Lectures
| Method | Endpoint                        | Description        | Access     |
|--------|---------------------------------|--------------------|------------|
| GET    | /api/lectures/course/:courseId  | Get course lectures| Public     |
| POST   | /api/lectures                   | Add lecture        | Instructor |
| PUT    | /api/lectures/:id               | Update lecture     | Instructor |
| DELETE | /api/lectures/:id               | Delete lecture     | Instructor |

### Reviews
| Method | Endpoint                    | Description       | Access  |
|--------|-----------------------------|-------------------|---------|
| GET    | /api/reviews/course/:id     | Get course reviews| Public  |
| POST   | /api/reviews                | Create review     | Student |
| DELETE | /api/reviews/:id            | Delete review     | Admin   |

### Admin
| Method | Endpoint                        | Description           | Access |
|--------|---------------------------------|-----------------------|--------|
| GET    | /api/admin/analytics            | Platform analytics    | Admin  |
| GET    | /api/admin/users                | All users             | Admin  |
| PUT    | /api/admin/users/:id/toggle     | Toggle user status    | Admin  |
| DELETE | /api/admin/users/:id            | Delete user           | Admin  |
| GET    | /api/admin/courses              | All courses           | Admin  |
| PUT    | /api/admin/courses/:id/status   | Approve/reject course | Admin  |

---

## 🗄 Database Schema

### User
```
name, email, password (hashed), role (student/instructor/admin),
avatar, bio, isActive, enrolledCourses[]
```

### Course
```
title, description, instructor (ref), category, level, price,
thumbnail, status (pending/approved/rejected), duration,
enrollmentCount, averageRating, tags[], requirements[], whatYouLearn[]
```

### Lecture
```
title, description, course (ref), videoUrl, duration, order,
isFree, resources[], quiz[]
```

### Enrollment
```
student (ref), course (ref), completedLectures[], progress,
isCompleted, assignment { submitted, content, grade }
```

### Review
```
student (ref), course (ref), rating (1-5), comment
```

---

## 🎨 Pages Overview

| Page                 | Route                         | Access      |
|----------------------|-------------------------------|-------------|
| Home                 | /                             | Public      |
| Login                | /login                        | Public      |
| Register             | /register                     | Public      |
| Course Listing       | /courses                      | Public      |
| Course Detail        | /courses/:id                  | Public      |
| Video Learning       | /learn/:courseId/:lectureId   | Student     |
| Student Dashboard    | /dashboard/student            | Student     |
| Instructor Dashboard | /dashboard/instructor         | Instructor  |
| Admin Dashboard      | /dashboard/admin              | Admin       |
| Profile              | /profile                      | Any user    |

---

## 🔒 Security Features
- JWT tokens with expiry (7 days)
- bcrypt password hashing (10 rounds)
- Role-based route protection
- HTTP-only approach
- Input validation
- Error handling middleware

---

## 📝 Notes for Submission
- This is a college final-year project showcasing full-stack MERN development
- All code is original and well-commented
- Follows RESTful API design principles
- Responsive design works on mobile and desktop
- Production-ready code structure

---

*Built with ❤️ using MERN Stack | SmartLearn LMS © 2024*
