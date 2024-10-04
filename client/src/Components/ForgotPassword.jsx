import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CSS/BackgroundImage.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/forgot-password', { email });
      setMessage('If this email exists, a reset link will be sent to your email.');
      setError('');
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen Image bg-gray-200 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg rounded-3xl sm:p-20 animate-fade-in">
          <div className="max-w-md mx-auto">
            <div className="text-center font-semibold text-xl mb-6 animate-slide-down">Forgot Password</div>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  className="mt-1 px-4 py-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {message && <p className="text-green-500 text-sm">{message}</p>}
              <button
                type="submit"
                className="w-full bg-teal-500 text-white py-2 px-4 rounded-md shadow hover:bg-teal-600 transition-transform duration-300 hover:scale-105"
              >
                Submit
              </button>
            </form>
            <div className="mt-6 text-center">
              <button onClick={() => window.location.reload(false)} className="text-teal-500 hover:underline">Back to Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
