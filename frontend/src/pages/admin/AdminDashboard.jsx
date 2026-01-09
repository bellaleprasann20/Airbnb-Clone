import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Home, 
  IndianRupee, 
  ShieldAlert, 
  TrendingUp, 
  MoreVertical,
  CheckCircle,
  XCircle
} from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('properties'); // properties | users | bookings
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error("Admin Access Denied", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <Loader type="full" />;

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> {trend} this month
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl">
          <Icon size={24} className="text-gray-700" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Admin Insights</h1>
          <p className="text-gray-500">Overview of your marketplace performance.</p>
        </div>
        <Button variant="dark" size="sm">Export Report</Button>
      </header>

      {/* 1. Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats?.totalUsers || '1,284'} icon={Users} trend="+12%" />
        <StatCard title="Active Listings" value={stats?.totalListings || '452'} icon={Home} trend="+5%" />
        <StatCard title="Total Revenue" value={`₹${(stats?.revenue || 842000).toLocaleString('en-IN')}`} icon={IndianRupee} trend="+18%" />
        <StatCard title="Pending Verifications" value="14" icon={ShieldAlert} trend="Needs Action" />
      </div>

      

      {/* 2. Management Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex border-b">
          {['properties', 'users', 'bookings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-sm font-semibold capitalize transition-all ${
                activeTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 3. Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
              <tr>
                <th className="px-6 py-4">Entity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* This would be mapped from stats[activeTab] */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div>
                      <p className="font-bold text-sm">Mountain Villa, Kasauli</p>
                      <p className="text-xs text-gray-500">Host: Rajesh Kumar</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold uppercase">
                    Pending Review
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">Oct 24, 2025</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors">
                      <CheckCircle size={18} />
                    </button>
                    <button className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;