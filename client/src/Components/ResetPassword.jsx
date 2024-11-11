import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post('https://contactmanager-yvwy.onrender.com/api/reset-password', { token, password: newPassword });
      setMessage('Password reset successfully.');

      setError('');
      navigate('/login');
    } catch (err) {
      console.error('Error from server:', err);
      setError('Error resetting password. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-[#051622] flex items-center justify-center">
      <div className="w-full max-w-md bg-[#deb992] p-8 rounded-lg shadow-lg animate-fade-in">
        <h1 className="text-2xl font-bold text-center text-[#051622] mb-6">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-[#1ba098] focus:border-[#1ba098]"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-[#1ba098] focus:border-[#1ba098]"
          />
          <button
            type="submit"
            className="w-full bg-[#232628] text-[#1ba098] p-3 rounded-lg font-semibold shadow hover:bg-[#101212] transition-transform duration-300 hover:scale-105"
          >
            Reset Password
          </button>
        </form>
        {message && <p className="text-green-500 text-center mt-4">{message}</p>}
        {error && <p className="text-[#1ba098] text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
