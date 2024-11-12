import React, { useState } from 'react';
import axios from 'axios';
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
      <div className="container mx-auto px-5 py-10 mt-20 max-w-4xl bg-[#deb992] rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-[#051622]">Add Contact</h2>
        {message && <div className="text-[#1ba098] mb-4">{message}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mb-4 p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            id="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="mb-4 p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mb-4 p-3 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className="bg-[#232628] hover:bg-[#101212] text-[#1ba098] px-5 py-2 rounded-lg"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContact;
