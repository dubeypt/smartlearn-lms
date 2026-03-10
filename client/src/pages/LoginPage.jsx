import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      navigate(`/dashboard/${data.user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (email, password) => {
    setForm({ email, password });
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(`Logged in as ${data.user.role}!`);
      navigate(`/dashboard/${data.user.role}`);
    } catch (err) {
      toast.error('Demo login failed. Please seed the database first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-display font-bold text-xl">S</span>
            </div>
            <span className="font-display font-bold text-2xl text-gray-900">Smart<span className="text-indigo-600">Learn</span></span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Sign in to continue learning</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">Welcome Back 👋</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" required className="input-field" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3 text-base flex items-center justify-center gap-2 mt-2">
              {loading ? <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-indigo-50 rounded-2xl">
            <p className="text-xs font-semibold text-indigo-700 mb-3 uppercase tracking-wide">Demo Accounts</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '🎓 Student', email: 'alice@smartlearn.com', pwd: 'password123' },
                { label: '👨‍🏫 Instructor', email: 'sarah@smartlearn.com', pwd: 'password123' },
                { label: '⚙️ Admin', email: 'admin@smartlearn.com', pwd: 'admin123' },
              ].map(({ label, email, pwd }) => (
                <button key={label} onClick={() => demoLogin(email, pwd)}
                  className="text-xs bg-white border border-indigo-200 text-indigo-700 py-2 px-2 rounded-xl hover:bg-indigo-100 transition-colors font-semibold">
                  {label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
