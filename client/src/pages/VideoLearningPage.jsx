import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function VideoLearningPage() {
  const { courseId, lectureId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [assignment, setAssignment] = useState('');
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [courseRes, lecturesRes, enrollRes] = await Promise.all([
          axios.get(`/api/courses/${courseId}`),
          axios.get(`/api/lectures/course/${courseId}`),
          axios.get('/api/enrollments/my'),
        ]);
        setCourse(courseRes.data.course);
        setLectures(lecturesRes.data.lectures);
        const myEnrollment = enrollRes.data.enrollments.find(e => e.course?._id === courseId);
        setEnrollment(myEnrollment);
        const lec = lecturesRes.data.lectures.find(l => l._id === lectureId) || lecturesRes.data.lectures[0];
        setCurrentLecture(lec);
      } catch (err) {
        toast.error('Access denied or course not found');
        navigate('/courses');
      }
    };
    fetch();
  }, [courseId, lectureId]);

  const markComplete = async () => {
    if (!currentLecture) return;
    try {
      const { data } = await axios.put('/api/enrollments/progress', { courseId, lectureId: currentLecture._id });
      setEnrollment(prev => ({ ...prev, completedLectures: data.enrollment.completedLectures, progress: data.progress }));
      toast.success('Marked as complete! ✅');
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleQuizSubmit = () => {
    const results = currentLecture.quiz.map((q, i) => ({
      question: q.question,
      correct: quizAnswers[i] === q.correctAnswer,
      yourAnswer: q.options[quizAnswers[i]],
      correctAnswer: q.options[q.correctAnswer],
    }));
    setQuizResults(results);
    const score = results.filter(r => r.correct).length;
    toast(score === results.length ? '🎉 Perfect score!' : `Score: ${score}/${results.length}`);
  };

  const submitAssignment = async () => {
    try {
      await axios.post('/api/enrollments/assignment', { courseId, content: assignment });
      toast.success('Assignment submitted! 📝');
      setAssignmentOpen(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const isCompleted = (lecId) => enrollment?.completedLectures?.includes(lecId);
  const progress = enrollment?.progress || 0;

  const getVideoEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/embed')) return url;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
  };

  if (!course || !currentLecture) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link to={`/courses/${courseId}`} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">S</span>
            </div>
            <span className="font-display font-bold text-sm hidden sm:block">SmartLearn</span>
          </Link>
          <div className="w-px h-5 bg-gray-700 hidden sm:block" />
          <span className="text-sm text-gray-300 font-medium hidden sm:block truncate max-w-xs">{course.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-28 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 progress-bar rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-gray-400 text-xs">{progress}%</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Player */}
          <div className="bg-black">
            <div className="max-w-5xl mx-auto aspect-video">
              {getVideoEmbedUrl(currentLecture.videoUrl) ? (
                <iframe src={getVideoEmbedUrl(currentLecture.videoUrl)} title={currentLecture.title}
                  className="w-full h-full" frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 to-gray-900">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎥</div>
                    <p className="text-gray-300">Video not available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lecture Info */}
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="font-display font-bold text-2xl mb-1">{currentLecture.title}</h1>
                {currentLecture.description && <p className="text-gray-400">{currentLecture.description}</p>}
              </div>
              <button onClick={markComplete}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isCompleted(currentLecture._id) ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                {isCompleted(currentLecture._id) ? '✓ Completed' : 'Mark Complete'}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {currentLecture.quiz?.length > 0 && (
                <button onClick={() => { setQuizOpen(true); setQuizResults(null); setQuizAnswers({}); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-xl text-sm font-semibold transition-colors">
                  📝 Take Quiz ({currentLecture.quiz.length} questions)
                </button>
              )}
              <button onClick={() => setAssignmentOpen(!assignmentOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-semibold transition-colors border border-gray-700">
                📋 Submit Assignment
              </button>
            </div>

            {/* Quiz Modal */}
            {quizOpen && (
              <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display font-bold text-lg">Quiz: {currentLecture.title}</h3>
                  <button onClick={() => setQuizOpen(false)} className="text-gray-400 hover:text-white">✕</button>
                </div>
                {currentLecture.quiz.map((q, qi) => (
                  <div key={qi} className="mb-6">
                    <p className="font-medium mb-3 text-gray-200">{qi + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <label key={oi} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                          quizResults
                            ? (oi === q.correctAnswer ? 'bg-green-900/40 border border-green-600' : quizAnswers[qi] === oi ? 'bg-red-900/40 border border-red-600' : 'bg-gray-800/50')
                            : (quizAnswers[qi] === oi ? 'bg-indigo-900/40 border border-indigo-600' : 'bg-gray-800 hover:bg-gray-700 border border-gray-700')
                        }`}>
                          <input type="radio" name={`q${qi}`} checked={quizAnswers[qi] === oi} onChange={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))} className="w-4 h-4 text-indigo-600" disabled={!!quizResults} />
                          <span className="text-sm text-gray-200">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                {!quizResults ? (
                  <button onClick={handleQuizSubmit} className="btn-primary py-2.5 px-6">Submit Quiz</button>
                ) : (
                  <div className="p-4 bg-indigo-900/30 rounded-xl border border-indigo-800">
                    <p className="font-semibold text-indigo-300">
                      Score: {quizResults.filter(r => r.correct).length}/{quizResults.length} correct! 🎯
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Assignment */}
            {assignmentOpen && (
              <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 mb-6">
                <h3 className="font-display font-bold text-lg mb-4">Submit Assignment</h3>
                <textarea value={assignment} onChange={e => setAssignment(e.target.value)}
                  placeholder="Write your assignment here..." rows={6}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-3" />
                <div className="flex gap-3">
                  <button onClick={submitAssignment} className="btn-primary py-2.5 px-6">Submit</button>
                  <button onClick={() => setAssignmentOpen(false)} className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-semibold border border-gray-700 transition-colors">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Lecture List */}
        {sidebarOpen && (
          <div className="w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto shrink-0">
            <div className="p-4 border-b border-gray-800">
              <h2 className="font-display font-bold text-sm">Course Content</h2>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
                </div>
                {progress}% complete
              </div>
            </div>
            <div className="p-2">
              {lectures.map((lec, i) => (
                <Link key={lec._id} to={`/learn/${courseId}/${lec._id}`}
                  onClick={() => setCurrentLecture(lec)}
                  className={`flex items-start gap-3 p-3 rounded-xl mb-1 transition-all group ${lec._id === currentLecture._id ? 'bg-indigo-900/50 border border-indigo-700' : 'hover:bg-gray-800'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs ${isCompleted(lec._id) ? 'bg-green-600 text-white' : lec._id === currentLecture._id ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                    {isCompleted(lec._id) ? '✓' : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium leading-snug ${lec._id === currentLecture._id ? 'text-indigo-300' : 'text-gray-300'}`}>{lec.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{lec.duration} min</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
