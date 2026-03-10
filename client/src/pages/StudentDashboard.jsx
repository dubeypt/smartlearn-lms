import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enrolled');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get('/api/enrollments/my');
        setEnrollments(data.enrollments);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const inProgress = enrollments.filter(e => !e.isCompleted && e.progress > 0);
  const completed = enrollments.filter(e => e.isCompleted);
  const notStarted = enrollments.filter(e => e.progress === 0);

  const StatsBar = () => (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {[
        { label: 'Enrolled', value: enrollments.length, icon: '📚', color: 'bg-indigo-50 text-indigo-700' },
        { label: 'In Progress', value: inProgress.length, icon: '⚡', color: 'bg-amber-50 text-amber-700' },
        { label: 'Completed', value: completed.length, icon: '🏆', color: 'bg-green-50 text-green-700' },
      ].map(stat => (
        <div key={stat.label} className={`${stat.color} rounded-2xl p-5`}>
          <div className="text-3xl mb-1">{stat.icon}</div>
          <div className="font-display font-extrabold text-2xl">{stat.value}</div>
          <div className="text-sm font-medium opacity-80">{stat.label}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            alt="" className="w-16 h-16 rounded-2xl border-2 border-indigo-100 shadow-md" />
          <div>
            <h1 className="font-display font-extrabold text-2xl text-gray-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-gray-500">Continue your learning journey</p>
          </div>
          <Link to="/courses" className="ml-auto btn-primary text-sm py-2">+ Explore Courses</Link>
        </div>

        <StatsBar />

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm w-fit">
          {[
            { id: 'enrolled', label: `All (${enrollments.length})` },
            { id: 'progress', label: `In Progress (${inProgress.length})` },
            { id: 'completed', label: `Completed (${completed.length})` },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:text-indigo-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Course Cards */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            {[1,2].map(i => <div key={i} className="skeleton h-36 rounded-2xl" />)}
          </div>
        ) : (
          (() => {
            const list = activeTab === 'enrolled' ? enrollments : activeTab === 'progress' ? inProgress : completed;
            return list.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-5xl mb-3">📭</div>
                <h3 className="font-display font-bold text-xl text-gray-700 mb-2">No courses here</h3>
                <p className="text-gray-400 mb-5">Start learning something new today!</p>
                <Link to="/courses" className="btn-primary">Browse Courses</Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {list.map(({ course, progress, isCompleted, completedLectures, _id: enrollId }) => (
                  <div key={enrollId} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex gap-4">
                    <img src={course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                      alt={course?.title} className="w-24 h-20 object-cover rounded-xl shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Link to={`/courses/${course?._id}`} className="font-display font-bold text-gray-900 text-sm hover:text-indigo-700 transition-colors line-clamp-2 leading-snug mb-1 block">
                        {course?.title}
                      </Link>
                      <p className="text-xs text-gray-400 mb-3">by {course?.instructor?.name}</p>

                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{completedLectures?.length || 0} lectures done</span>
                          <span className={`font-semibold ${isCompleted ? 'text-green-600' : 'text-indigo-600'}`}>{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full progress-bar ${isCompleted ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }} />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {isCompleted ? (
                          <span className="badge bg-green-100 text-green-700 text-xs">🏆 Completed</span>
                        ) : (
                          <Link to={`/learn/${course?._id}/${course?.lectures?.[0] || ''}`}
                            className="badge bg-indigo-100 text-indigo-700 text-xs hover:bg-indigo-200 transition-colors">
                            {progress > 0 ? '▶ Continue' : '▶ Start'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
