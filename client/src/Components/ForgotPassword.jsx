import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import './CSS/BackgroundImage.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a request to send OTP to the email
      const res = await axios.post('http://localhost:5000/api/forgot-password', { email });
      // Set success message
      setMessage('If this email exists, an OTP will be sent to your email.');

      // Navigate to OTP Verification component
      navigate('/otp-verification', { state: { email } });

      setError('');
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="bg-[#051622] min-h-screen flex flex-col justify-center py-12 transition duration-300 ease-in-out">
      <div className="relative py-3 sm:max-w-xl mx-auto">
        <div className="relative px-4 py-10 bg-[#deb992] shadow-lg rounded-3xl sm:p-20 animate-fade-in">
          <div className="max-w-md mx-auto">
            <div className="text-center font-semibold text-2xl mb-6 text-[#051622] animate-slide-down">Forgot Password</div>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#051622]">Email</label>
                <input
                  type="email"
                  name="email"
                  className="mt-1 px-4 py-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1ba098] focus:border-[#1ba098]"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required // Make the email field required
                />
              </div>
              {error && <p className="text-[#1ba098] text-sm">{error}</p>}
              {message && <p className="text-green-500 text-sm">{message}</p>}
              <button
                type="submit"
                className="w-full bg-[#232628] text-[#1ba098] py-2 px-4 rounded-md shadow hover:bg-[#101212] transition-transform duration-300 hover:scale-105"
              >
                Submit
              </button>
            </form>
            <div className="mt-6 text-center">
              <button onClick={() => window.location.reload(false)} className="text-[#1ba098] hover:underline">Back to Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
