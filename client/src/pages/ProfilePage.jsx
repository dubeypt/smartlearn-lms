import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';

export default function ProfilePage() {
  const { user, updateUser, loadUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.put('/api/auth/profile', form);
      updateUser(data.user);
      toast.success('Profile updated! ✅');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    setSaving(true);
    try {
      await axios.put('/api/auth/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const roleColors = { admin: 'bg-purple-100 text-purple-700', instructor: 'bg-blue-100 text-blue-700', student: 'bg-green-100 text-green-700' };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-20 -translate-y-20" />
          </div>
          <div className="relative flex items-center gap-5">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl border-4 border-white/30 shadow-xl"
            />
            <div>
              <h1 className="font-display font-extrabold text-2xl">{user?.name}</h1>
              <p className="text-indigo-200 text-sm">{user?.email}</p>
              <span className={`badge mt-2 text-xs capitalize ${roleColors[user?.role]}`}>{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm w-fit">
          {[{ id: 'profile', label: '👤 Profile' }, { id: 'password', label: '🔒 Password' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:text-indigo-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display font-bold text-lg mb-5">Edit Profile</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Avatar URL</label>
                <input value={form.avatar} onChange={e => setForm(p => ({ ...p, avatar: e.target.value }))}
                  placeholder="https://..." className="input-field" />
                {form.avatar && (
                  <img src={form.avatar} alt="Preview" className="w-12 h-12 rounded-xl mt-2 border border-gray-200" />
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
                <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  rows={3} placeholder="Tell us about yourself..." className="input-field resize-none" />
              </div>
              <button type="submit" disabled={saving} className="btn-primary py-3 w-full">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {tab === 'password' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display font-bold text-lg mb-5">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {[
                { key: 'currentPassword', label: 'Current Password' },
                { key: 'newPassword', label: 'New Password' },
                { key: 'confirmPassword', label: 'Confirm New Password' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                  <input type="password" value={pwForm[f.key]}
                    onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder="••••••••" required className="input-field" />
                </div>
              ))}
              <button type="submit" disabled={saving} className="btn-primary py-3 w-full">
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
