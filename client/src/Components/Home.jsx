import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phoneNumber: '',
    email: '',
    userMail: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(()=>{
    const usermail = localStorage.getItem('userEmail')
    if (usermail) {
      setFormData((prevData) => ({ ...prevData, userMail: usermail })); // Set the email
    }
  },[])

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    

    try {

      const response = await axios.post('http://localhost:5000/api/contact', formData);
      console.log('Contact added:', response.data);

      setContacts([...contacts, { ...formData, id: response.data.id }]);

      setFormData({ id: '', name: '', phoneNumber: '', email: '' });
      window.location.reload();
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-[#051622] min-h-screen flex flex-col items-center transition duration-300 ease-in-out py-5">
      <header className="w-full bg-[#051622] py-4 fixed top-0 left-0 z-10 shadow-lg">
        <nav className="flex justify-between items-center max-w-4xl mx-auto px-5">
          <div className="text-2xl font-bold text-[#deb992]">Contact Manager</div>
          <div className="flex items-center space-x-6">
            <ul className="flex space-x-6">
              <li>
                <Link to={'/savedContacts'} className="hover:underline text-[#1ba098] transition duration-300 ease-in-out hover:text-white">Saved Contacts</Link>
              </li>
              <li>
                <Link to={'/savedContacts'} className="hover:underline text-[#1ba098] transition duration-300 ease-in-out hover:text-white">Contact List</Link>
              </li>
            </ul>
            <div className="relative">
              <CiSearch className="absolute left-3 top-2 w-6 h-6 text-[#1ba098]" /> {/* Position the search icon */}
              <input
                type="text"
                // placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-lg p-2 pl-10 pr-2 text-[#1ba098] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1ba098] shadow-md"
              />
            </div>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-5 py-5 mt-20 max-w-4xl">
        <div id="contact-form-section" className="mb-6 p-5 bg-[#deb992] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#051622]">Add Contact</h2>
          <form id="contact-form" onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="hidden"
              id="contact-id"
              value={formData.id}
              onChange={handleChange}
            />
            <input
              type="text"
              id="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mb-4 p-3 border border-gray-300 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#051622] shadow-md hover:shadow-lg"
            />
            <input
              type="text"
              id="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="mb-4 p-3 border border-gray-300 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#051622] shadow-md hover:shadow-lg"
            />
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mb-4 p-3 border border-gray-300 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#051622] shadow-md hover:shadow-lg"
            />
            <button
              type="submit"
              className="bg-[#232628] hover:bg-[#101212] text-[#1ba098] px-5 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-100"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
