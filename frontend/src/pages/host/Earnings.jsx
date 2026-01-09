import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, CreditCard, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';

const Earnings = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [earnings, setEarnings] = useState({
    total: 0,
    thisMonth: 0,
    pending: 0,
    paid: 0
  });
  
  const [transactions, setTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchEarnings = async () => {
      // TODO: Replace with actual API
      // const token = localStorage.getItem('token');
      // const response = await fetch(`${API_BASE_URL}/api/v1/host/earnings?range=${timeRange}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      setTimeout(() => {
        setEarnings({
          total: 145000,
          thisMonth: 32500,
          pending: 8500,
          paid: 136500
        });
        
        setMonthlyData([
          { month: 'Jan', amount: 28000 },
          { month: 'Feb', amount: 32000 },
          { month: 'Mar', amount: 25000 },
          { month: 'Apr', amount: 38000 },
          { month: 'May', amount: 42000 },
          { month: 'Jun', amount: 35000 }
        ]);
        
        setTransactions([
          {
            id: 't1',
            date: '2026-01-03',
            guestName: 'Rajesh Kumar',
            propertyTitle: 'Luxury Villa in Goa',
            amount: 25500,
            status: 'completed',
            type: 'booking'
          },
          {
            id: 't2',
            date: '2026-01-02',
            guestName: 'Priya Sharma',
            propertyTitle: 'Cozy Apartment in Mumbai',
            amount: 10500,
            status: 'pending',
            type: 'booking'
          },
          {
            id: 't3',
            date: '2025-12-28',
            guestName: 'Amit Patel',
            propertyTitle: 'Beachfront Cottage in Kerala',
            amount: 18000,
            status: 'completed',
            type: 'booking'
          },
          {
            id: 't4',
            date: '2025-12-25',
            guestName: 'Platform Fee',
            propertyTitle: 'Service Charge',
            amount: -2500,
            status: 'completed',
            type: 'fee'
          },
          {
            id: 't5',
            date: '2025-12-20',
            guestName: 'Sneha Reddy',
            propertyTitle: 'Luxury Villa in Goa',
            amount: 25500,
            status: 'completed',
            type: 'booking'
          },
          {
            id: 't6',
            date: '2025-12-15',
            guestName: 'Vikram Singh',
            propertyTitle: 'Cozy Apartment in Mumbai',
            amount: 14000,
            status: 'completed',
            type: 'booking'
          }
        ]);
        
        setLoading(false);
      }, 1000);
    };
    
    fetchEarnings();
  }, [timeRange]);

  const exportData = () => {
    // TODO: Implement CSV/PDF export
    alert('Exporting earnings data...');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const maxAmount = Math.max(...monthlyData.map(d => d.amount));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-600 mt-1">Track your income and payouts</p>
          </div>
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 bg-white hover:border-gray-400 transition-colors"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-gray-400 transition-colors"
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <DollarSign size={24} />
              </div>
              <TrendingUp size={20} className="opacity-80" />
            </div>
            <p className="text-white/80 text-sm font-medium mb-1">Total Earnings</p>
            <p className="text-3xl font-bold">₹{earnings.total.toLocaleString('en-IN')}</p>
            <p className="text-white/80 text-xs mt-2">+12.5% from last month</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Calendar size={24} className="text-blue-600" />
              </div>
              <ArrowUpRight size={20} className="text-green-500" />
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">This Month</p>
            <p className="text-3xl font-bold text-gray-900">₹{earnings.thisMonth.toLocaleString('en-IN')}</p>
            <p className="text-green-600 text-xs mt-2 font-semibold">+8.2% increase</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <CreditCard size={24} className="text-yellow-600" />
              </div>
              <div className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">Pending</div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Pending</p>
            <p className="text-3xl font-bold text-gray-900">₹{earnings.pending.toLocaleString('en-IN')}</p>
            <p className="text-gray-500 text-xs mt-2">Available in 2-3 days</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <DollarSign size={24} className="text-purple-600" />
              </div>
              <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">Paid</div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Paid Out</p>
            <p className="text-3xl font-bold text-gray-900">₹{earnings.paid.toLocaleString('en-IN')}</p>
            <p className="text-gray-500 text-xs mt-2">{transactions.filter(t => t.status === 'completed').length} transactions</p>
          </div>
        </div>

        {/* Chart and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Monthly Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Overview</h2>
            
            <div className="flex items-end justify-between h-64 gap-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-rose-500 to-pink-500 rounded-t-lg transition-all hover:from-rose-600 hover:to-pink-600 cursor-pointer"
                      style={{ height: `${(data.amount / maxAmount) * 100}%` }}
                      title={`₹${data.amount.toLocaleString('en-IN')}`}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                        ₹{data.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg per booking</p>
                  <p className="text-xl font-bold text-gray-900">₹15,200</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <TrendingUp size={20} className="text-blue-600" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total bookings</p>
                  <p className="text-xl font-bold text-gray-900">24</p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <Calendar size={20} className="text-green-600" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Success rate</p>
                  <p className="text-xl font-bold text-gray-900">96.8%</p>
                </div>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <ArrowUpRight size={20} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
              <Filter size={16} />
              Filter
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Guest / Description</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Property</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(transaction.date).toLocaleDateString('en-IN', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-semibold text-gray-900">{transaction.guestName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-600">{transaction.propertyTitle}</p>
                    </td>
                    <td className="p-4">
                      <p className={`text-sm font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-100 text-center">
            <button className="text-sm font-semibold text-rose-500 hover:underline">
              Load more transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;