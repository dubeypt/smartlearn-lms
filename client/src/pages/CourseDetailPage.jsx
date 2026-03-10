import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(s => (
      <svg key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
  </div>
);

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [expandedSections, setExpandedSections] = useState([0]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [courseRes, reviewRes] = await Promise.all([
          axios.get(`/api/courses/${id}`),
          axios.get(`/api/reviews/course/${id}`),
        ]);
        setCourse(courseRes.data.course);
        setReviews(reviewRes.data.reviews);

        // Check enrollment
        if (user?.role === 'student') {
          try {
            const { data } = await axios.get('/api/enrollments/my');
            setIsEnrolled(data.enrollments.some(e => e.course?._id === id));
          } catch {}
        }
      } catch (err) { toast.error('Course not found'); navigate('/courses'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    if (user.role !== 'student') return toast.error('Only students can enroll');
    setEnrolling(true);
    try {
      await axios.post('/api/enrollments', { courseId: id });
      setIsEnrolled(true);
      toast.success('Enrolled successfully! 🎉');
      navigate(`/learn/${id}/${course.lectures[0]?._id}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Enrollment failed'); }
    finally { setEnrolling(false); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const { data } = await axios.post('/api/reviews', { courseId: id, ...reviewForm });
      setReviews(prev => [data.review, ...prev]);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted! ⭐');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review'); }
    finally { setSubmittingReview(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-16 animate-pulse">
        <div className="skeleton h-8 w-1/2 rounded mb-4" />
        <div className="skeleton h-4 w-full rounded mb-2" />
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>
    </div>
  );

  if (!course) return null;

  const levelColor = { Beginner: 'bg-green-100 text-green-700', Intermediate: 'bg-amber-100 text-amber-700', Advanced: 'bg-red-100 text-red-700' };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-indigo-950 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-indigo-600/30 text-indigo-300 px-3 py-1 rounded-full font-semibold">{course.category}</span>
              <span className={`badge text-xs ${levelColor[course.level]}`}>{course.level}</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl leading-tight mb-4">{course.title}</h1>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">{course.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <img src={course.instructor?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor?.name}`}
                  alt="" className="w-7 h-7 rounded-full border-2 border-indigo-400" />
                <span className="text-indigo-300">{course.instructor?.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <StarRating rating={course.averageRating} />
                <span className="text-amber-400 font-bold ml-1">{course.averageRating?.toFixed(1)}</span>
                <span className="text-gray-400">({course.totalRatings} reviews)</span>
              </div>
              <span className="text-gray-400">👥 {course.enrollmentCount} students</span>
              <span className="text-gray-400">⏱ {course.duration}</span>
            </div>
          </div>

          {/* Enroll Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
            <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover rounded-xl mb-5" />
            <div className="text-3xl font-display font-extrabold text-indigo-700 mb-4">
              {course.price === 0 ? '🎁 Free' : `₹${course.price}`}
            </div>
            {isEnrolled ? (
              <Link to={`/learn/${id}/${course.lectures?.[0]?._id}`}
                className="block w-full text-center btn-primary py-3.5 text-base">
                ▶ Continue Learning
              </Link>
            ) : (
              <button onClick={handleEnroll} disabled={enrolling}
                className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2">
                {enrolling ? <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Enrolling...</> : '🎓 Enroll Now'}
              </button>
            )}
            <ul className="mt-5 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">✅ Full lifetime access</li>
              <li className="flex items-center gap-2">✅ {course.lectures?.length || 0} video lectures</li>
              <li className="flex items-center gap-2">✅ Certificate on completion</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* What You'll Learn */}
          {course.whatYouLearn?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-display font-bold text-xl mb-4">What You'll Learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {course.whatYouLearn.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-indigo-500 mt-0.5 shrink-0">✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-display font-bold text-xl mb-4">Course Content</h2>
            <p className="text-sm text-gray-500 mb-4">{course.lectures?.length || 0} lectures • {course.duration}</p>
            <div className="space-y-2">
              {course.lectures?.map((lec, i) => (
                <div key={lec._id} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 cursor-pointer hover:bg-indigo-50 transition-colors"
                    onClick={() => setExpandedSections(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full flex items-center justify-center">{i+1}</span>
                      <span className="font-medium text-sm">{lec.title}</span>
                      {lec.isFree && <span className="badge bg-green-100 text-green-700 text-xs">Free</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{lec.duration} min</span>
                      {lec.quiz?.length > 0 && <span className="badge bg-purple-100 text-purple-700">Quiz</span>}
                    </div>
                  </div>
                  {expandedSections.includes(i) && lec.description && (
                    <div className="p-3.5 border-t border-gray-100 text-sm text-gray-600">{lec.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-display font-bold text-xl mb-6">Student Reviews</h2>
            {/* Review Summary */}
            <div className="flex items-center gap-6 p-5 bg-indigo-50 rounded-2xl mb-6">
              <div className="text-center">
                <div className="text-5xl font-display font-extrabold text-indigo-700">{course.averageRating?.toFixed(1)}</div>
                <StarRating rating={course.averageRating} />
                <p className="text-xs text-gray-500 mt-1">{course.totalRatings} ratings</p>
              </div>
            </div>

            {/* Add Review */}
            {user?.role === 'student' && isEnrolled && (
              <form onSubmit={handleReviewSubmit} className="bg-gray-50 rounded-2xl p-5 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Leave a Review</h3>
                <div className="flex gap-2 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: s }))}>
                      <svg className={`w-7 h-7 transition-colors ${s <= reviewForm.rating ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </button>
                  ))}
                </div>
                <textarea value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                  placeholder="Share your experience..." required rows={3} className="input-field resize-none mb-3" />
                <button type="submit" disabled={submittingReview} className="btn-primary py-2 text-sm">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            {/* Review List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No reviews yet. Be the first!</p>
              ) : reviews.map(review => (
                <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={review.student?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.student?.name}`}
                      alt="" className="w-9 h-9 rounded-full" />
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{review.student?.name}</p>
                      <StarRating rating={review.rating} />
                    </div>
                    <span className="ml-auto text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm pl-12">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Requirements */}
          {course.requirements?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-display font-bold text-base mb-3">Requirements</h3>
              <ul className="space-y-2">
                {course.requirements.map((r, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-gray-400 mt-0.5">•</span>{r}</li>)}
              </ul>
            </div>
          )}
          {/* Instructor */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-display font-bold text-base mb-3">Your Instructor</h3>
            <div className="flex items-center gap-3">
              <img src={course.instructor?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor?.name}`}
                alt="" className="w-12 h-12 rounded-full border-2 border-indigo-100" />
              <div>
                <p className="font-semibold text-gray-800">{course.instructor?.name}</p>
                <p className="text-xs text-indigo-600">Expert Instructor</p>
              </div>
            </div>
            {course.instructor?.bio && <p className="text-sm text-gray-500 mt-3">{course.instructor.bio}</p>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
