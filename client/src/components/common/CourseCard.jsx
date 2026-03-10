import { Link } from 'react-router-dom';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(star => (
      <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
        fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
  </div>
);

const levelColors = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-red-100 text-red-700',
};

export default function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course._id}`} className="card group block">
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-44 bg-indigo-100">
        <img
          src={course.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800`}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {course.price === 0 && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">FREE</span>
        )}
        <span className={`absolute top-3 right-3 badge text-xs ${levelColors[course.level] || 'bg-gray-100 text-gray-700'}`}>
          {course.level}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">{course.category}</span>
        <h3 className="font-display font-bold text-gray-900 mt-1 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors text-base leading-snug">
          {course.title}
        </h3>
        <p className="text-gray-500 text-sm mb-3 flex items-center gap-1.5">
          <img
            src={course.instructor?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor?.name}`}
            alt={course.instructor?.name}
            className="w-5 h-5 rounded-full border border-gray-200"
          />
          {course.instructor?.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={course.averageRating || 0} />
          <span className="text-sm font-semibold text-amber-500">{course.averageRating?.toFixed(1) || '0.0'}</span>
          <span className="text-xs text-gray-400">({course.totalRatings || 0})</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {course.enrollmentCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.duration}
            </span>
          </div>
          <span className="font-display font-bold text-indigo-700 text-lg">
            {course.price === 0 ? 'Free' : `₹${course.price}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
