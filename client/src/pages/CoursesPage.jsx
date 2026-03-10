import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CourseCard from '../components/common/CourseCard';

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Machine Learning', 'Mobile Development',
                    'Cloud Computing', 'Cybersecurity', 'UI/UX Design', 'DevOps', 'Database'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const SORTS = [
  { label: 'Newest', value: '' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Price: Low', value: 'price-low' },
  { label: 'Price: High', value: 'price-high' },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [sort, setSort] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category !== 'All') params.set('category', category);
        if (level !== 'All') params.set('level', level);
        if (sort) params.set('sort', sort);
        const { data } = await axios.get(`/api/courses?${params.toString()}`);
        setCourses(data.courses);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    const timer = setTimeout(fetchCourses, 300);
    return () => clearTimeout(timer);
  }, [search, category, level, sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display font-extrabold text-4xl mb-3">Explore All Courses</h1>
          <p className="text-indigo-100 mb-6">Discover {courses.length}+ courses from expert instructors</p>
          {/* Search */}
          <div className="relative max-w-xl">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search courses..." className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 focus:outline-none focus:bg-white/20 backdrop-blur-sm" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 shadow-sm">
          <div className="flex flex-wrap gap-4 items-start">
            {/* Category Filter */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${category === c ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            {/* Level + Sort */}
            <div className="flex gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Level</p>
                <select value={level} onChange={e => setLevel(e.target.value)} className="input-field py-2 text-sm w-36">
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sort</p>
                <select value={sort} onChange={e => setSort(e.target.value)} className="input-field py-2 text-sm w-36">
                  {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-gray-600 text-sm">
            {loading ? 'Loading...' : <><span className="font-bold text-gray-900">{courses.length}</span> courses found</>}
          </p>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton h-40 w-full" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-3 w-1/3 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-3 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display font-bold text-xl text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
            {courses.map(course => <CourseCard key={course._id} course={course} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
