import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Download, 
  ExternalLink, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await api.get('/payments/history');
        setTransactions(data);
      } catch (err) {
        console.error("Failed to load payments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const StatusBadge = ({ status }) => {
    const styles = {
      completed: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      failed: "bg-red-100 text-red-700 border-red-200",
      refunded: "bg-blue-100 text-blue-700 border-blue-200"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${styles[status] || styles.pending}`}>
        {status}
      </span>
    );
  };

  if (loading) return <Loader type="full" />;

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Payments & Payouts</h1>
        <p className="text-gray-500">Review your payments, coupons, and taxes.</p>
      </header>

      {/* 1. Saved Methods Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your payment methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border rounded-2xl flex flex-col justify-between h-40 bg-gray-50 border-dashed border-gray-300 items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
            <Plus className="text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-600">Add payment method</p>
          </div>
          
          {/* Example of a dummy saved card logic */}
          <div className="p-6 border rounded-2xl flex flex-col justify-between h-40 shadow-sm bg-white">
            <div className="flex justify-between items-start">
              <CreditCard className="text-gray-700" size={32} />
              <span className="text-xs font-bold text-gray-400 uppercase">Primary</span>
            </div>
            <div>
              <p className="font-mono text-lg">•••• •••• •••• 4242</p>
              <p className="text-xs text-gray-500 uppercase mt-1">Expires 12/26</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Transaction History Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Payment History</h2>
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-4">Booking / ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.length > 0 ? transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-sm text-gray-900">{tx.propertyTitle}</p>
                      <p className="text-xs text-gray-400">TXN_{tx.razorpay_payment_id.slice(-8)}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">
                      No payment transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. Tax Information (Crucial for GST context) */}
      <div className="p-6 bg-[#F7F7F7] rounded-2xl border border-gray-200 flex items-start gap-4">
        <AlertCircle className="text-gray-400 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-gray-900">Need a GST invoice?</h4>
          <p className="text-sm text-gray-600 mt-1">
            If you're traveling for work, you can add your GST details to your profile to get business tax invoices for eligible stays.
          </p>
          <button className="mt-3 text-sm font-bold underline underline-offset-4">
            Manage GST details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payments;