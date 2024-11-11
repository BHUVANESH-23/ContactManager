import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import "./CSS/BackgroundImage.css";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState(''); // State to handle error message
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Password validation function (example)
  const validatePassword = (password) => {
    return password.length >= 8; // Minimum 8 characters
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message before submitting
    setSuccessMessage(''); // Reset success message before submitting

    // Validate password before making request
    if (!validatePassword(formData.password)) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    try {
      const response = await axios.post('https://contactmanager-yvwy.onrender.com/api/signup', formData);
      console.log(response.data.message);

      if (response.status === 201) {
        setSuccessMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after success message
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error); // Set the error message to display
      } else {
        setErrorMessage('An error occurred during sign up. Please try again.');
      }
    }
  };

  return (
    <div className="bg-[#051622] min-h-screen flex flex-col justify-center py-12 transition duration-300 ease-in-out">
      <div className="relative py-3 sm:max-w-xl mx-auto">
        <div className="relative px-4 py-10 bg-[#deb992] shadow-lg rounded-3xl sm:p-20 animate-fade-in">
          <div className="max-w-md mx-auto">
            <div className="text-center font-semibold text-2xl mb-6 text-[#051622] animate-slide-down">Sign Up</div>

            {/* Error message display */}
            {errorMessage && (
              <div className="mb-4 text-[#1ba098] text-center">{errorMessage}</div>
            )}

            {/* Success message display */}
            {successMessage && (
              <div className="mb-4 text-green-500 text-center">{successMessage}</div>
            )}

            <form>
              <div className="grid grid-cols-2 gap-5">
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[#051622]">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 px-4 py-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1ba098] focus:border-[#1ba098]"
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[#051622]">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 px-4 py-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1ba098] focus:border-[#1ba098]"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#051622]">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 px-4 py-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1ba098] focus:border-[#1ba098]"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#051622]">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 px-4 py-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1ba098] focus:border-[#1ba098]"
                  placeholder="Enter your password"
                />
              </div>
              <button
                onClick={handleSubmit}
                type="submit"
                className="w-full bg-[#232628] text-[#1ba098] py-2 px-4 rounded-md shadow hover:bg-[#101212] transition-transform duration-300 hover:scale-105"
              >
                Sign Up
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-[#051622]">
                Already have an account?
                <button onClick={handleLogin} className="text-[#1ba098] hover:underline">&nbsp; Login</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
