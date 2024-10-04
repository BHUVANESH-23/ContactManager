import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ForgotPassword from './ForgotPassword'; // Import ForgotPassword
import './CSS/BackgroundImage.css'

const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: ''
  });
  const [pass, setPass] = useState(false); // Existing pass state
  const [errorMessage, setErrorMessage] = useState(''); // Add state for error message
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", input);
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userEmail', input.email); 

        navigate('/');
      } 
      } catch (err) {
        if (err.response ) {
          // Set error message if 404 is encountered
          setErrorMessage(err.response.data.message);
        } else {
        console.error(err);
      }
    }
  };

  if (pass) {
    // Render ForgotPassword page if "Forgot Password" is clicked
    return <ForgotPassword />;
  }

  return (
    <div className="min-h-screen Image bg-gray-200 flex flex-col justify-center sm:py-10">
      <div className="relative py-2 sm:max-w-xl sm:mx-auto">
        <div className="px-2 py-2 bg-white shadow-lg rounded-3xl sm:p-16 animate-fade-in">
          <div className="max-w-md mx-auto">
            <div className="text-center font-semibold text-xl mb-4 animate-slide-down">Login</div>

            {/* Display error message if credentials are wrong */}
            {errorMessage && (
              <div className="text-center text-red-500 mb-4">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  className="mt-1 px-4 py-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  value={input.email}
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  className="mt-1 px-4 py-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={input.password}
                />
              </div>
              <div className="text-right mb-5">
                <button type='button' onClick={() => setPass(true)} className="text-sm text-teal-500 hover:underline">Forgot password?</button>
              </div>
              <button
                type="submit"
                className="w-full bg-teal-500 text-white py-2 px-4 rounded-md shadow hover:bg-teal-600 transition-transform duration-300 hover:scale-105"
              >
                Login
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm">
                Don't have an account?
                <button onClick={handleSignup} className="text-teal-500 hover:underline"> &nbsp; Sign Up</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
