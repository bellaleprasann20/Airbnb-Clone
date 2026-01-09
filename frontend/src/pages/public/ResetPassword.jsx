import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from "../../context/AppContext";
import { Lock, Loader2, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const { resettoken } = useParams(); 
  const navigate = useNavigate();
  const { API_BASE_URL } = useApp();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password.length < 6) {
      return alert("Password must be at least 6 characters long");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    setLoading(true);
    try {
      // Ensure this endpoint matches your backend route exactly
      const res = await axios.put(`${API_BASE_URL}/api/v1/auth/resetpassword/${resettoken}`, { 
        password: password 
      });

      if (res.data.success) {
        setIsSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      console.error("Reset Error:", err.response?.data);
      alert(err.response?.data?.message || "Invalid or expired token. Please request a new link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-20">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        {!isSuccess ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">New Password</h2>
              <p className="text-gray-500 mt-2">Create a secure password for your account.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  placeholder="New Password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  placeholder="Confirm Password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-500 text-white py-3 rounded-xl font-bold hover:bg-rose-600 active:scale-[0.98] transition-all flex items-center justify-center disabled:bg-gray-400"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Reset Password"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-500" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h2>
            <p className="text-gray-500">Your password has been changed successfully. Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;