import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const OTPVerification = () => {
  const location = useLocation();
  const { email } = location.state; // Retrieve email from state
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await axios.post('https://contactmanager-yvwy.onrender.com/api/forgot-password/verify-otp', { email, otp });
      console.log(response.data);
      // If OTP is valid, navigate to the reset password page
      navigate(`/reset-password?token=${otp}`); // Use the OTP as the token
    } catch (error) {
      // Set error message based on server response
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while verifying OTP. Please try again.');
      }
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#051622] text-[#1ba098]">
      <h2 className="text-2xl mb-6">Enter OTP</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-[#deb992] p-6 rounded-lg shadow-lg w-96">
        <div className="mb-4">
          <label htmlFor="otp" className="block text-[#051622] font-semibold">OTP</label>
          <input
            type="text"
            id="otp"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-[#1ba098] hover:bg-[#107c70] text-white py-3 rounded-lg transition duration-300">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OTPVerification;
