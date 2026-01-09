import React, { useState } from 'react';
import axios from 'axios';
import { useApp } from "../../context/AppContext";
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { API_BASE_URL } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/v1/auth/forgotpassword`, { email });
      setIsSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl">
        <Link to="/login" className="flex items-center text-sm text-gray-500 hover:text-black mb-6">
          <ArrowLeft size={16} className="mr-2" /> Back to Login
        </Link>

        {!isSent ? (
          <>
            <h2 className="text-3xl font-bold mb-2">Forgot Password?</h2>
            <p className="text-gray-500 mb-8">Enter your email and we'll send you a link to reset your password.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:border-rose-500 transition"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                disabled={loading}
                className="w-full bg-rose-500 text-white py-3 rounded-xl font-bold hover:bg-rose-600 transition flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={60} />
            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
            <p className="text-gray-500 mb-8">
              We've sent a password reset link to <span className="font-semibold text-black">{email}</span>
            </p>
            <button 
              onClick={() => setIsSent(false)} 
              className="text-rose-500 font-bold hover:underline"
            >
              Didn't get the email? Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;