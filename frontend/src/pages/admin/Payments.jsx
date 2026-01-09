import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Download, 
  Filter,
  CheckCircle2,
  Clock
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/priceCalc';
import { formatDate } from '../../utils/formatDate';

const AdminPayments = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalVolume: 0, platformFees: 0, pendingPayouts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await api.get('/admin/payments');
        setTransactions(data.transactions);
        setStats(data.stats);
      } catch (err) {
        console.error("Failed to load financial data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Overview</h1>
          <p className="text-gray-500">Track marketplace revenue and host disbursements.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-xl font-bold hover:bg-gray-50 transition">
          <Download size={18} /> Export CSV
        </button>
      </header>

      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
          <div className="flex justify-between text-gray-500 text-sm font-semibold">
            Total Booking Volume <IndianRupee size={16} />
          </div>
          <p className="text-3xl font-bold">{formatCurrency(stats.totalVolume)}</p>
          <p className="text-xs text-green-600 font-bold">↑ 12% from last month</p>
        </div>

        <div className="bg-black text-white p-6 rounded-2xl shadow-sm space-y-2">
          <div className="flex justify-between text-gray-400 text-sm font-semibold">
            Platform Revenue (Fees) <ArrowUpRight size={16} />
          </div>
          <p className="text-3xl font-bold">{formatCurrency(stats.platformFees)}</p>
          <p className="text-xs text-gray-400">Net earnings after GST</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
          <div className="flex justify-between text-gray-500 text-sm font-semibold">
            Pending Host Payouts <Clock size={16} />
          </div>
          <p className="text-3xl font-bold">{formatCurrency(stats.pendingPayouts)}</p>
          <p className="text-xs text-amber-600 font-bold">42 transfers scheduled</p>
        </div>
      </div>

      

      {/* 2. Transaction Table */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Booking ID or Guest..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-black transition"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold flex items-center gap-2">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Guest / Host</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-gray-500">{tx.id}</td>
                <td className="px-6 py-4 text-sm">{formatDate(tx.date)}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold">{tx.guestName}</p>
                  <p className="text-xs text-gray-500">to {tx.hostName}</p>
                </td>
                <td className="px-6 py-4 font-bold text-sm">
                  {formatCurrency(tx.amount)}
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1 text-xs font-bold ${
                    tx.status === 'completed' ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {tx.status === 'completed' ? <CheckCircle2 size={14}/> : <Clock size={14}/>}
                    {tx.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs font-bold text-rose-600 hover:underline">View PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;