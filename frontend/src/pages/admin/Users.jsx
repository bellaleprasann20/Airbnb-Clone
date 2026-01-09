import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  UserMinus, 
  Mail, 
  ShieldCheck, 
  MoreVertical, 
  Search,
  BadgeCheck
} from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users');
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleBan = async (userId, isCurrentlyBanned) => {
    try {
      const action = isCurrentlyBanned ? 'unban' : 'ban';
      await api.patch(`/admin/users/${userId}/${action}`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBanned: !isCurrentlyBanned } : u));
    } catch (err) {
      alert("Error updating user status");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader type="full" />;

  return (
    <div className="p-8 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-gray-500">Manage {users.length} registered members and their permissions.</p>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search email or name..."
            className="pl-10 pr-4 py-2 border rounded-full text-sm w-64 outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4">User Details</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Identity</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user._id} className={`hover:bg-gray-50 transition-colors ${user.isBanned ? 'bg-red-50/30' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail size={12} /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    user.role === 'host' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.isVerified ? (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                      <BadgeCheck size={16} /> Verified
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs italic">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => handleToggleBan(user._id, user.isBanned)}
                      className={`p-2 rounded-lg transition-colors ${
                        user.isBanned ? 'text-green-600 hover:bg-green-50' : 'text-red-500 hover:bg-red-50'
                      }`}
                      title={user.isBanned ? "Unban User" : "Ban User"}
                    >
                      {user.isBanned ? <UserCheck size={20} /> : <UserMinus size={20} />}
                    </button>
                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;