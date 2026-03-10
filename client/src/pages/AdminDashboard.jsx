import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, usersRes, coursesRes] = await Promise.all([
        axios.get('/api/admin/analytics'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/courses'),
      ]);
      setAnalytics(analyticsRes.data.analytics);
      setUsers(usersRes.data.users);
      setCourses(coursesRes.data.courses);
    } catch (err) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const toggleUser = async (id) => {
    try {
      const { data } = await axios.put(`/api/admin/users/${id}/toggle`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: data.user.isActive } : u));
      toast.success(data.message);
    } catch { toast.error('Failed'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed'); }
  };

  const updateCourseStatus = async (id, status) => {
    try {
      const { data } = await axios.put(`/api/admin/courses/${id}/status`, { status });
      setCourses(prev => prev.map(c => c._id === id ? { ...c, status } : c));
      toast.success(`Course ${status}!`);
    } catch { toast.error('Failed'); }
  };

  const StatCard = ({ label, value, icon, color }) => (
    <div className={`${color} rounded-2xl p-5`}>
      <div className="text-3xl mb-1">{icon}</div>
      <div className="font-display font-extrabold text-2xl">{value}</div>
      <div className="text-sm font-medium opacity-75">{label}</div>
    </div>
  );

  const roleColors = { admin: 'bg-purple-100 text-purple-700', instructor: 'bg-blue-100 text-blue-700', student: 'bg-green-100 text-green-700' };
  const statusColors = { approved: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', rejected: 'bg-red-100 text-red-700' };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-white text-2xl">⚙️</span>
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Platform management & analytics</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm w-fit flex-wrap">
          {['overview', 'users', 'courses'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:text-indigo-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && analytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Total Users" value={analytics.totalUsers} icon="👥" color="bg-indigo-50 text-indigo-700" />
                  <StatCard label="Courses" value={analytics.totalCourses} icon="📚" color="bg-purple-50 text-purple-700" />
                  <StatCard label="Enrollments" value={analytics.totalEnrollments} icon="🎓" color="bg-green-50 text-green-700" />
                  <StatCard label="Pending Approval" value={analytics.pendingCourses} icon="⏳" color="bg-amber-50 text-amber-700" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <StatCard label="Students" value={analytics.students} icon="🎓" color="bg-blue-50 text-blue-700" />
                  <StatCard label="Instructors" value={analytics.instructors} icon="👨‍🏫" color="bg-teal-50 text-teal-700" />
                  <StatCard label="Reviews" value={analytics.totalReviews} icon="⭐" color="bg-pink-50 text-pink-700" />
                </div>

                {/* Recent Activity */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-display font-bold text-base mb-4">Recent Users</h3>
                    <div className="space-y-3">
                      {analytics.recentUsers?.map(u => (
                        <div key={u._id} className="flex items-center gap-3">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt="" className="w-8 h-8 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                          <span className={`badge text-xs ${roleColors[u.role]}`}>{u.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-display font-bold text-base mb-4">Top Courses</h3>
                    <div className="space-y-3">
                      {analytics.topCourses?.map(c => (
                        <div key={c._id} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-sm">📚</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{c.title}</p>
                            <p className="text-xs text-gray-400">{c.instructor?.name}</p>
                          </div>
                          <span className="text-xs text-gray-500 font-semibold">👥 {c.enrollmentCount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-display font-bold text-lg">All Users ({users.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.map(u => (
                        <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt="" className="w-8 h-8 rounded-full" />
                              <span className="text-sm font-medium text-gray-800">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-500">{u.email}</td>
                          <td className="px-5 py-3">
                            <span className={`badge text-xs ${roleColors[u.role]}`}>{u.role}</span>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`badge text-xs ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => toggleUser(u._id)}
                                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                {u.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              {u.role !== 'admin' && (
                                <button onClick={() => deleteUser(u._id)} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 font-semibold transition-colors">
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="font-display font-bold text-lg">All Courses ({courses.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Course', 'Instructor', 'Category', 'Status', 'Students', 'Actions'].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {courses.map(c => (
                        <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <img src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100'} alt="" className="w-10 h-8 object-cover rounded-lg" />
                              <span className="text-sm font-medium text-gray-800 line-clamp-1 max-w-48">{c.title}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-500">{c.instructor?.name}</td>
                          <td className="px-5 py-3 text-xs text-gray-500">{c.category}</td>
                          <td className="px-5 py-3">
                            <span className={`badge text-xs ${statusColors[c.status]}`}>{c.status}</span>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-500">{c.enrollmentCount}</td>
                          <td className="px-5 py-3">
                            <div className="flex gap-2">
                              {c.status !== 'approved' && (
                                <button onClick={() => updateCourseStatus(c._id, 'approved')}
                                  className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-semibold transition-colors">
                                  ✓ Approve
                                </button>
                              )}
                              {c.status !== 'rejected' && (
                                <button onClick={() => updateCourseStatus(c._id, 'rejected')}
                                  className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition-colors">
                                  ✕ Reject
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
