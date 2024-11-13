import React, { useState } from 'react';
import axios from 'axios';
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const AddContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    userMail: localStorage.getItem('userEmail') || ''
  });
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleGoogle = (e) => {
    e.preventDefault(); 
    const userMail = localStorage.getItem('userEmail');
    if (!userMail) {
      console.error('User email not found in localStorage.');
      return;
    }
    window.location.href = `https://contactmanager-yvwy.onrender.com/api/google-contacts?userMail=${encodeURIComponent(userMail)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://contactmanager-yvwy.onrender.com/api/contact', formData);
      if (response.status === 201) {
        setMessage('Contact saved successfully!');
        navigate("/");
      }
      setFormData({ name: '', phoneNumber: '', email: '', userMail: formData.userMail });
    } catch (error) {
      console.error('Error adding contact:', error);
      setMessage('Error saving contact. Please try again.');
    }
  };

  return (
    <div className="bg-[#051622] min-h-screen flex flex-col items-center py-5">
      <header className="w-full bg-[#051622] py-4 fixed top-0 left-0 z-10 shadow-lg">
        <nav className="flex justify-between items-center max-w-4xl mx-auto px-5">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#deb992] cursor-pointer" onClick={() => navigate('/')}>
            Contact Manager
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-5 py-5 mt-20 max-w-4xl">
        <div className='flex justify-between'>
          <h2 className="text-xl font-semibold mb-4 text-[#deb992]">Add Contact</h2>
          <button onClick={handleGoogle} className="hover:underline text-[#1ba098] mt-[-10px] hover:text-white flex items-center">
            <FaGoogle className="mr-1 " />
            Add from Google
          </button>
        </div>
        {message && <div className="text-[#1ba098] mb-4">{message}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col bg-[#deb992] p-5 rounded-lg shadow-md">
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mb-4 mt-1 p-2 border border-gray-300 rounded-lg "
          />
          <input
            type="text"
            id="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="mb-4 mt-1 p-2 border border-gray-300 rounded-lg "
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mb-4 mt-1 p-2 border border-gray-300 rounded-lg "
          />
          <button
            type="submit"
            className="bg-[#232628] hover:bg-[#101212] text-[#1ba098] px-5 py-2 rounded-lg text-sm sm:text-base md:text-lg"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContact;
