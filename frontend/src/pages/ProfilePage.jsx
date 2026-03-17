import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Phone, MapPin, Lock, Save, Package } from 'lucide-react';
import api from '../api/axios';
import { getMe } from '../store/authSlice';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: '', phone: '', address: { street: '', city: '', state: '', zip: '', country: '' } });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  useEffect(() => {
    if (user) setProfile({ name: user.name || '', phone: user.phone || '', address: user.address || { street: '', city: '', state: '', zip: '', country: '' } });
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', profile);
      await dispatch(getMe());
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    try {
      await api.put('/auth/password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
    finally { setSaving(false); }
  };

  const tabs = [{ id: 'profile', label: 'Profile', icon: User }, { id: 'security', label: 'Security', icon: Lock }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-2xl sm:text-3xl">My Account</h1>
        <Link to="/orders" className="flex items-center gap-2 btn-secondary py-2 px-4 text-sm"><Package size={15} />My Orders</Link>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 text-center mb-4">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl font-bold text-primary-700">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <h3 className="font-bold text-gray-900">{user?.name}</h3>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            {user?.role === 'ADMIN' && <span className="badge bg-primary-100 text-primary-700 mt-2">Admin</span>}
          </div>
          <div className="card p-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Icon size={16} />{label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {tab === 'profile' && (
            <form onSubmit={handleProfileSave} className="card p-6 space-y-6">
              <h2 className="font-bold text-lg">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 flex items-center gap-1"><User size={13} />Full Name</label>
                  <input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 flex items-center gap-1"><Mail size={13} />Email</label>
                  <input value={user?.email} disabled className="input-field bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 flex items-center gap-1"><Phone size={13} />Phone</label>
                  <input value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} placeholder="+1 (555) 000-0000" className="input-field" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><MapPin size={15} />Default Address</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Street Address</label>
                    <input value={profile.address?.street || ''} onChange={(e) => setProfile({...profile, address: {...profile.address, street: e.target.value}})} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">City</label>
                    <input value={profile.address?.city || ''} onChange={(e) => setProfile({...profile, address: {...profile.address, city: e.target.value}})} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">State</label>
                    <input value={profile.address?.state || ''} onChange={(e) => setProfile({...profile, address: {...profile.address, state: e.target.value}})} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">ZIP Code</label>
                    <input value={profile.address?.zip || ''} onChange={(e) => setProfile({...profile, address: {...profile.address, zip: e.target.value}})} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Country</label>
                    <input value={profile.address?.country || ''} onChange={(e) => setProfile({...profile, address: {...profile.address, country: e.target.value}})} className="input-field" />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2"><Save size={16} />{saving ? 'Saving...' : 'Save Changes'}</button>
            </form>
          )}

          {tab === 'security' && (
            <form onSubmit={handlePasswordChange} className="card p-6 space-y-5">
              <h2 className="font-bold text-lg">Change Password</h2>
              <div>
                <label className="block text-sm font-medium mb-1.5">Current Password</label>
                <input type="password" required value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">New Password</label>
                <input type="password" required minLength={6} value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
                <input type="password" required value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} className={`input-field ${passwords.confirm && passwords.confirm !== passwords.newPassword ? 'border-red-300' : ''}`} />
              </div>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2"><Lock size={16} />{saving ? 'Updating...' : 'Update Password'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
