import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold">S</span>
              </div>
              <span className="font-display font-bold text-xl text-white">Smart<span className="text-indigo-400">Learn</span></span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              Empowering learners worldwide with quality education. Build skills, advance your career, and achieve your goals.
            </p>
          </div>
          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-3 text-sm uppercase tracking-wide">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-indigo-400 transition-colors">All Courses</Link></li>
              <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Become Instructor</Link></li>
              <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Student Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white mb-3 text-sm uppercase tracking-wide">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Help Center</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © 2024 SmartLearn LMS — Final Year College Project | Built with MERN Stack 🚀
        </div>
      </div>
    </footer>
  );
}
