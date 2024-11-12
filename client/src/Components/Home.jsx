import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";

const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      const userMail = localStorage.getItem('userEmail');
      try {
        const response = await axios.get('https://contactmanager-yvwy.onrender.com/api/contact', {
          headers: { userMail }
        });
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  const handleGoogle = () => {
    const userMail = localStorage.getItem('userEmail');
    if (!userMail) {
      console.error('User email not found in localStorage.');
      return;
    }
    window.location.href = `https://contactmanager-yvwy.onrender.com/api/google-contacts?userMail=${encodeURIComponent(userMail)}`;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
    contact.phoneNumber.startsWith(searchTerm)
  );
  

  return (
    <div className="bg-[#051622] min-h-screen flex flex-col items-center py-5">
      <header className="w-full bg-[#051622] py-4 fixed top-0 left-0 z-10 shadow-lg">
        <nav className="flex justify-between items-center max-w-6xl mx-auto px-5">
          <div className="text-2xl font-bold text-[#deb992]">Contact Manager</div>
          <ul className="flex flex-grow justify-center space-x-10 pt-2">
            <li>
              <Link to={'/savedContacts'} className="hover:underline text-[#1ba098] hover:text-white">Saved Contacts</Link>
            </li>
            <li>
              <Link to={'/addContact'} className="hover:underline text-[#1ba098] hover:text-white">Add Contact</Link>
            </li>
            <li className="flex items-center">
              <button onClick={handleGoogle} className="hover:underline text-[#1ba098] hover:text-white flex items-center">
                <FaGoogle className="mr-1" />
                Add from Google
              </button>
            </li>
          </ul>
          <div className="relative">
            <CiSearch className="absolute left-3 top-2 w-6 h-6 text-[#1ba098]" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border rounded-lg p-2 pl-10 pr-2 text-black"
            />
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-5 py-5 mt-20 max-w-4xl">
        {message && <div className='text-[#1ba098] mb-4'>{message}</div>}
        <div className="flex justify-around  mb-16">
          <button
            onClick={() => navigate('/savedContacts')}
            className="bg-[#deb992] text-black px-10 py-4 rounded-lg hover:bg-[#c8a063] transition"
          >
            Saved Contacts
          </button>
          <button
            onClick={() => navigate('/addContact')}
            className="bg-[#deb992] text-black px-10 py-4 rounded-lg hover:bg-[#c8a063] transition"
          >
            Add Contact
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          {filteredContacts.length > 0 ? (
            <table className="min-w-full bg-[#f3d3b1]  rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="py-3 px-5 text-left font-semibold text-[#1ba098]">Name</th>
                  <th className="py-3 px-5 text-left font-semibold text-[#1ba098]">Phone Number</th>
                  <th className="py-3 px-5 text-left font-semibold text-[#1ba098]">Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-[#c8a063] cursor-pointer" onClick={() => navigate('/savedContacts')}> 
                    <td className="py-3 px-5">{contact.name}</td>
                    <td className="py-3 px-5">{contact.phoneNumber}</td>
                    <td className="py-3 px-5">{contact.email}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          ) : (
            <p className="text-[#deb992]">No contacts found.</p>
          )}
        </div>


      </div>
    </div>
  );
};

export default Home;
