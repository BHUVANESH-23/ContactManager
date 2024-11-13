import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const EditContact = () => {
  const { state } = useLocation();
  const [contact, setContact] = useState(state.contact || {});
  const [name, setName] = useState(contact.name || '');
  const [phoneNumber, setPhoneNumber] = useState(contact.phoneNumber || '');
  const [email, setEmail] = useState(contact.email || '');
  
  const navigate = useNavigate();

  useEffect(() => {
    setContact(state.contact || {});
    setName(state.contact?.name || '');
    setPhoneNumber(state.contact?.phoneNumber || '');
    setEmail(state.contact?.email || '');
  }, [state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedContact = { ...contact, name, phoneNumber, email };
      await axios.put(`https://contactmanager-yvwy.onrender.com/api/contact/${contact._id}`, updatedContact);
      navigate('/');
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  return (
    <div className="bg-[#051622] min-h-screen flex flex-col items-center py-5">
      <header className="w-full bg-[#051622] py-4 fixed top-0 left-0 z-10 shadow-lg">
        <nav className="flex justify-between items-center max-w-4xl mx-auto px-5">
          <div className="text-2xl font-bold text-[#deb992] cursor-pointer" onClick={() => navigate('/')}>
            Contact Manager
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-5 py-5 mt-20 max-w-4xl">
        <h2 className="text-xl font-semibold mb-4 text-[#deb992]">Edit Contact</h2>
        <form onSubmit={handleSubmit} className="bg-[#deb992] p-5 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="text-[#051622]" htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
              
            />
          </div>

          <div className="mb-4">
            <label className="text-[#051622]" htmlFor="phoneNumber">Phone:</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
              
            />
          </div>

          <div className="mb-4">
            <label className="text-[#051622]" htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <button type="submit" className="bg-[#232628] hover:bg-[#101212] text-[#1ba098] px-5 py-2 rounded-lg text-sm sm:text-base md:text-lg">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditContact;
