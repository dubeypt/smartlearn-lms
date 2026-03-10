import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';

const statusBadge = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-700',
};

const CATEGORIES = ['Web Development', 'Data Science', 'Machine Learning', 'Mobile Development',
                    'Cloud Computing', 'Cybersecurity', 'UI/UX Design', 'DevOps', 'Database', 'Other'];

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseLectures, setCourseLectures] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: 'Web Development', level: 'Beginner', price: 0, thumbnail: '', duration: '', requirements: '', whatYouLearn: '' });
  const [lectureForm, setLectureForm] = useState({ title: '', description: '', videoUrl: '', duration: 0, isFree: false });
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/api/courses/instructor/my');
      setCourses(data.courses);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements.split('\n').filter(Boolean),
        whatYouLearn: form.whatYouLearn.split('\n').filter(Boolean),
      };
      const { data } = await axios.post('/api/courses', payload);
      setCourses(prev => [data.course, ...prev]);
      setShowCreateModal(false);
      toast.success('Course created! Pending admin approval 🎉');
      setForm({ title: '', description: '', category: 'Web Development', level: 'Beginner', price: 0, thumbnail: '', duration: '', requirements: '', whatYouLearn: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post('/api/lectures', { ...lectureForm, course: selectedCourse._id });
      setCourseLectures(prev => [...prev, data.lecture]);
      toast.success('Lecture added!');
      setLectureForm({ title: '', description: '', videoUrl: '', duration: 0, isFree: false });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const openCourseDetail = async (course) => {
    setSelectedCourse(course);
    setActiveTab('lectures');
    try {
      const [lectRes, studRes] = await Promise.all([
        axios.get(`/api/lectures/course/${course._id}`),
        axios.get(`/api/courses/${course._id}/students`),
      ]);
      setCourseLectures(lectRes.data.lectures);
      setStudents(studRes.data.enrollments);
    } catch (err) { console.error(err); }
  };

  const deleteLecture = async (id) => {
    if (!window.confirm('Delete this lecture?')) return;
    try {
      await axios.delete(`/api/lectures/${id}`);
      setCourseLectures(prev => prev.filter(l => l._id !== id));
      toast.success('Lecture deleted');
    } catch (err) { toast.error('Failed to delete'); }
  };

  const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0);
  const avgRating = courses.length ? (courses.reduce((s, c) => s + (c.averageRating || 0), 0) / courses.length).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
              alt="" className="w-14 h-14 rounded-2xl border-2 border-indigo-100 shadow-md" />
            <div>
              <h1 className="font-display font-extrabold text-2xl text-gray-900">Instructor Dashboard</h1>
              <p className="text-gray-500">Welcome, {user?.name}!</p>
            </div>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">+ Create Course</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'My Courses', value: courses.length, icon: '📚', color: 'bg-indigo-50 text-indigo-700' },
            { label: 'Approved', value: courses.filter(c => c.status === 'approved').length, icon: '✅', color: 'bg-green-50 text-green-700' },
            { label: 'Total Students', value: totalEnrollments, icon: '👥', color: 'bg-amber-50 text-amber-700' },
            { label: 'Avg Rating', value: avgRating, icon: '⭐', color: 'bg-purple-50 text-purple-700' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-2xl p-5`}>
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="font-display font-extrabold text-2xl">{s.value}</div>
              <div className="text-sm font-medium opacity-80">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm w-fit">
          {['courses', 'lectures', 'students'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:text-indigo-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* My Courses Tab */}
        {activeTab === 'courses' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? <div className="col-span-3 text-center py-20 text-gray-400">Loading...</div> :
             courses.length === 0 ? (
              <div className="col-span-3 text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-5xl mb-3">📚</div>
                <h3 className="font-display font-bold text-xl text-gray-700 mb-2">No courses yet</h3>
                <button onClick={() => setShowCreateModal(true)} className="btn-primary mt-3">Create Your First Course</button>
              </div>
            ) : courses.map(course => (
              <div key={course._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'} alt={course.title} className="w-full h-36 object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`badge text-xs ${statusBadge[course.status]}`}>{course.status}</span>
                    <span className="text-xs text-gray-400">{course.category}</span>
                  </div>
                  <h3 className="font-display font-bold text-gray-900 text-sm mb-2 line-clamp-2">{course.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>👥 {course.enrollmentCount} students</span>
                    <span>⭐ {course.averageRating?.toFixed(1) || '0.0'}</span>
                    <span>💰 {course.price === 0 ? 'Free' : `₹${course.price}`}</span>
                  </div>
                  <button onClick={() => openCourseDetail(course)}
                    className="w-full btn-outline py-2 text-sm">
                    Manage Course →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lectures Tab */}
        {activeTab === 'lectures' && (
          <div>
            {!selectedCourse ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-400">Select a course from "My Courses" tab to manage lectures</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-indigo-100 rounded-xl">📚</div>
                  <div>
                    <h2 className="font-display font-bold text-lg">{selectedCourse.title}</h2>
                    <p className="text-sm text-gray-500">{courseLectures.length} lectures</p>
                  </div>
                </div>

                {/* Add Lecture Form */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
                  <h3 className="font-display font-bold text-base mb-4">Add New Lecture</h3>
                  <form onSubmit={handleAddLecture} className="grid md:grid-cols-2 gap-4">
                    <input value={lectureForm.title} onChange={e => setLectureForm(p => ({ ...p, title: e.target.value }))} placeholder="Lecture title *" required className="input-field" />
                    <input value={lectureForm.videoUrl} onChange={e => setLectureForm(p => ({ ...p, videoUrl: e.target.value }))} placeholder="YouTube URL (optional)" className="input-field" />
                    <input value={lectureForm.description} onChange={e => setLectureForm(p => ({ ...p, description: e.target.value }))} placeholder="Description" className="input-field" />
                    <input type="number" value={lectureForm.duration} onChange={e => setLectureForm(p => ({ ...p, duration: Number(e.target.value) }))} placeholder="Duration (minutes)" className="input-field" />
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isFree" checked={lectureForm.isFree} onChange={e => setLectureForm(p => ({ ...p, isFree: e.target.checked }))} className="w-4 h-4 text-indigo-600" />
                      <label htmlFor="isFree" className="text-sm text-gray-700">Free Preview Lecture</label>
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary py-2.5 text-sm">
                      {submitting ? 'Adding...' : '+ Add Lecture'}
                    </button>
                  </form>
                </div>

                {/* Lecture List */}
                <div className="space-y-3">
                  {courseLectures.map((lec, i) => (
                    <div key={lec._id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full flex items-center justify-center">{i+1}</span>
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{lec.title}</p>
                          <p className="text-xs text-gray-500">{lec.duration} min {lec.isFree && '· Free Preview'}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteLecture(lec._id)} className="text-red-400 hover:text-red-600 transition-colors text-sm">🗑 Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div>
            {!selectedCourse ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-400">Select a course first from "My Courses" tab</p>
              </div>
            ) : (
              <div>
                <h2 className="font-display font-bold text-lg mb-4">Students in "{selectedCourse.title}"</h2>
                {students.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <div className="text-4xl mb-3">👥</div>
                    <p className="text-gray-400">No students enrolled yet</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {['Student', 'Email', 'Progress', 'Enrolled On'].map(h => (
                            <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {students.map(({ student, progress, createdAt }) => (
                          <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <img src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt="" className="w-8 h-8 rounded-full" />
                                <span className="text-sm font-medium text-gray-800">{student.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-500">{student.email}</td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
                                </div>
                                <span className="text-xs text-gray-500">{progress}%</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl">Create New Course</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Course title *" required className="input-field" />
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Course description *" required rows={3} className="input-field resize-none" />
              <div className="grid grid-cols-2 gap-4">
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-field">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))} className="input-field">
                  {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} placeholder="Price (0 for free)" min="0" className="input-field" />
                <input value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="Duration (e.g. '12 hours')" className="input-field" />
              </div>
              <input value={form.thumbnail} onChange={e => setForm(p => ({ ...p, thumbnail: e.target.value }))} placeholder="Thumbnail image URL" className="input-field" />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Requirements (one per line)</label>
                <textarea value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))} rows={2} placeholder="Basic JavaScript&#10;HTML & CSS knowledge" className="input-field resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">What Students Will Learn (one per line)</label>
                <textarea value={form.whatYouLearn} onChange={e => setForm(p => ({ ...p, whatYouLearn: e.target.value }))} rows={2} placeholder="Build React apps&#10;Use React Hooks" className="input-field resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="flex-1 btn-primary py-3 text-base">
                  {submitting ? 'Creating...' : 'Create Course'}
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 btn-outline py-3">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
