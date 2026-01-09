import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      // UPDATED URL: Added /v1 to match backend app.js
      const res = await axios.post('http://localhost:5000/api/v1/auth/register', {
        name: fullName,
        email: formData.email,
        password: formData.password,
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[568px] bg-white rounded-xl shadow-2xl overflow-hidden">
        
        <div className="relative border-b py-4 flex items-center justify-center font-bold text-gray-800">
          <button onClick={() => navigate('/')} className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} />
          </button>
          Finish signing up
        </div>

        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm animate-in fade-in zoom-in">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div className="relative border border-gray-400 rounded-lg p-3 focus-within:ring-2 focus-within:ring-black">
                <label className="block text-[11px] font-bold text-gray-500 uppercase">First name</label>
                <input
                  type="text"
                  required
                  className="w-full outline-none text-base bg-transparent"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="relative border border-gray-400 rounded-lg p-3 focus-within:ring-2 focus-within:ring-black">
                <label className="block text-[11px] font-bold text-gray-500 uppercase">Last name</label>
                <input
                  type="text"
                  required
                  className="w-full outline-none text-base bg-transparent"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            
            <div className="relative border border-gray-400 rounded-lg p-3 focus-within:ring-2 focus-within:ring-black">
              <label className="block text-[11px] font-bold text-gray-500 uppercase">Email</label>
              <input
                type="email"
                required
                className="w-full outline-none text-base bg-transparent"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative border border-gray-400 rounded-lg p-3 focus-within:ring-2 focus-within:ring-black">
              <label className="block text-[11px] font-bold text-gray-500 uppercase">Password</label>
              <div className="flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full outline-none text-base bg-transparent"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 hover:text-black">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-lg font-bold text-white bg-[#FF385C] hover:bg-[#E31C5F] transition-all flex items-center justify-center disabled:bg-gray-300">
              {isSubmitting ? "Creating account..." : "Agree and continue"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t text-center text-sm">
            Already have an account? <Link to="/login" className="font-bold underline">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;