import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CourseCard from '../components/common/CourseCard';

const StatCard = ({ value, label, icon }) => (
  <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-3xl font-display font-bold text-indigo-700">{value}</div>
    <div className="text-gray-500 text-sm mt-1">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
    <div className="w-12 h-12 bg-indigo-50 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center text-2xl mb-4 transition-colors">
      {icon}
    </div>
    <h3 className="font-display font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{desc}</p>
  </div>
);

export default function HomePage() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get('/api/courses?sort=popular');
        setFeaturedCourses(data.courses.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>1,200+ students learning right now</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-tight mb-6">
              Learn Without<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-400">
                Limits 🚀
              </span>
            </h1>
            <p className="text-indigo-100 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
              Access world-class courses from expert instructors. Build real-world skills, get certified, and advance your career with SmartLearn LMS.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/courses" className="bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-display font-bold text-base hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                Explore Courses →
              </Link>
              <Link to="/register" className="bg-white/10 border border-white/30 text-white px-8 py-3.5 rounded-xl font-display font-bold text-base hover:bg-white/20 transition-all backdrop-blur-sm">
                Start for Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="50+" label="Expert Courses" icon="📚" />
          <StatCard value="5,000+" label="Students Enrolled" icon="🎓" />
          <StatCard value="20+" label="Instructors" icon="👨‍🏫" />
          <StatCard value="4.8★" label="Average Rating" icon="⭐" />
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wide mb-1">Most Popular</p>
            <h2 className="font-display font-extrabold text-3xl text-gray-900">Featured Courses</h2>
          </div>
          <Link to="/courses" className="text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition-colors flex items-center gap-1">
            View All <span>→</span>
          </Link>
        </div>
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="card">
                <div className="skeleton h-44 w-full" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-4 w-1/3 rounded" />
                  <div className="skeleton h-5 w-full rounded" />
                  <div className="skeleton h-4 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {featuredCourses.map(course => <CourseCard key={course._id} course={course} />)}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wide mb-2">Why SmartLearn?</p>
            <h2 className="font-display font-extrabold text-3xl text-gray-900">Everything You Need to Succeed</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard icon="🎯" title="Track Your Progress" desc="Visual progress bars and completion tracking keep you motivated throughout your learning journey." />
            <FeatureCard icon="🎥" title="Video Lectures" desc="Watch high-quality lectures at your own pace. Pause, rewind, and learn on any device." />
            <FeatureCard icon="📝" title="Assignments & Quizzes" desc="Test your understanding with interactive quizzes and submit assignments to instructors." />
            <FeatureCard icon="⭐" title="Expert Instructors" desc="Learn from industry professionals with real-world experience and passion for teaching." />
            <FeatureCard icon="📜" title="Get Certified" desc="Complete courses and earn certificates to showcase your skills to employers." />
            <FeatureCard icon="💬" title="Rate & Review" desc="Share your experience and help other students make informed decisions about courses." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-20 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl mb-4">Ready to Start Learning?</h2>
          <p className="text-indigo-100 text-lg mb-8">Join thousands of students already learning on SmartLearn. Sign up free today.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-display font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Create Free Account
            </Link>
            <Link to="/courses" className="border-2 border-white/40 text-white px-8 py-3.5 rounded-xl font-display font-bold hover:bg-white/10 transition-all">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
