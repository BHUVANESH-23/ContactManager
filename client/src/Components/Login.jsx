import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ForgotPassword from './ForgotPassword'; 


const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: ''
  });
  const [pass, setPass] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(''); 
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
      const res = await axios.post("https://contactmanager-yvwy.onrender.com/api/login", input);
      if (res.status === 200) {
        
        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('userEmail', input.email); 

        
        navigate('/');
      }
    } catch (err) {
      if (err.response) {
        
        setErrorMessage(err.response.data.message);
      } else {
        console.error('Error during login:', err);
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  if (pass) {
    
    return <ForgotPassword />;
  }

  return (
    <div className="bg-[#051622] min-h-screen flex flex-col items-center justify-center transition duration-300 ease-in-out py-5">
      <div className="relative py-2 sm:max-w-md w-full mx-auto">
        <div className="px-4 py-5 bg-[#deb992] shadow-lg rounded-lg sm:p-10 animate-fade-in">
          <div className="text-center font-semibold text-2xl mb-6 text-[#051622]">Login</div>

          {/* Display error message if credentials are wrong */}
          {errorMessage && (
            <div className="text-center text-[#1ba098] mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#051622]">Email</label>
              <input
                type="email"
                name="email"
                className="mt-1 px-4 py-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1ba098] focus:border-[#1ba098]"
                placeholder="Enter your email"
                onChange={handleChange}
                value={input.email}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#051622]">Password</label>
              <input
                type="password"
                name="password"
                className="mt-1 px-4 py-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1ba098] focus:border-[#1ba098]"
                placeholder="Enter your password"
                onChange={handleChange}
                value={input.password}
              />
            </div>
            <div className="text-right mb-4">
              <button type="button" onClick={() => setPass(true)} className="text-sm text-[#1ba098] hover:underline">
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-[#232628] text-[#1ba098] py-2 px-4 rounded-md shadow hover:bg-[#101212] transition-transform duration-300 hover:scale-105"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#051622]">
              Don't have an account?
              <button onClick={handleSignup} className="text-[#1ba098] hover:underline">&nbsp; Sign Up</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
