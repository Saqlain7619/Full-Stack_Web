import { useState, useEffect } from 'react';
import { Trash2, ShieldCheck, User, Search } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/admin/users'); setUsers(data.users); setTotal(data.total); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Change ${user.name} to ${newRole}?`)) return;
    try { await api.put(`/admin/users/${user.id}`, { role: newRole }); toast.success('Role updated'); load(); }
    catch { toast.error('Failed to update role'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try { await api.delete(`/admin/users/${id}`); toast.success('User deleted'); load(); }
    catch { toast.error('Failed to delete user'); }
  };

  const filtered = users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm">{total} total users</p>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        {loading ? <Spinner className="py-12" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>{['User', 'Role', 'Orders', 'Joined', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">{user.name?.[0]}</div>
                        <div><p className="font-medium">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${user.role === 'ADMIN' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
                        {user.role === 'ADMIN' ? <ShieldCheck size={11} className="inline mr-1" /> : <User size={11} className="inline mr-1" />}{user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user._count?.orders || 0}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleRole(user)} className={`p-1.5 rounded-lg transition-colors ${user.role === 'ADMIN' ? 'hover:bg-gray-100' : 'hover:bg-primary-50 hover:text-primary-600'}`} title="Toggle role"><ShieldCheck size={14} /></button>
                        <button onClick={() => deleteUser(user.id)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <div className="text-center py-12 text-gray-500"><p>No users found</p></div>}
          </div>
        )}
      </div>
    </div>
  );
}
