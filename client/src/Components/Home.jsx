import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";

const Home = () => {
  const [contacts, setContacts] = useState([]); // Initial state for contacts
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phoneNumber: '',
    email: '',
    userMail: ''
  });
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [message, setMessage] = useState(''); // Initialize as an empty string
  const [contactList, setContactList] = useState(''); // Initialize empty contactList

  useEffect(() => {
    const usermail = localStorage.getItem('userEmail');

    const fetchContacts = async () => {
      const userMail = localStorage.getItem('userEmail');

      if (usermail) {
        setFormData((prevData) => ({ ...prevData, userMail: usermail }));
      }

      try {
        const response = await axios.get('https://contactmanager-yvwy.onrender.com/api/contact', {
          headers: { userMail }
        });
        setContactList(response.data); // Set the fetched contacts into state
        setContacts(response.data); // Initialize the contacts list
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts(); // Invoke the function to fetch contacts
  }, []); // Only run once on mount

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleGoogle = () => {
    const userMail = localStorage.getItem('userEmail');

    if (!userMail) {
      console.error('User email not found in localStorage.');
      return;
    }
    window.location.href = `https://contactmanager-yvwy.onrender.com/api/google-contacts?userMail=${encodeURIComponent(userMail)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const response = await axios.post('https://contactmanager-yvwy.onrender.com/api/contact', formData);
      if (response.status === 201) {
        setMessage('Contact saved successfully!'); // Set success message
      }
      setContacts([...contacts, { ...formData, id: response.data.id }]); // Add new contact to list
      setFormData({
        id: '',
        name: '',
        phoneNumber: '',
        email: '',
        userMail: formData.userMail // Preserve userMail
      });
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error) {
      console.error('Error adding contact:', error);
      setMessage('Error saving contact. Please try again.'); // Set error message
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to filter contacts based on search term
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phoneNumber.includes(searchTerm)
  );

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
              <li className="flex items-center">
                <button onClick={handleGoogle} className="mb-2 hover:underline text-[#1ba098] transition duration-300 ease-in-out hover:text-white flex items-center">
                  <FaGoogle className="mr-1" />
                  Add
                </button>
              </li>
            </ul>
            <div className="relative">
              <CiSearch className="absolute left-3 top-2 w-6 h-6 text-[#1ba098]" />
              <input
                type="text"
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
          {message && ( // Only show message if it's not empty
            <div className='text-[#1ba098] mb-4'>
              {message}
            </div>
          )}
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

        {/* Only display filtered contacts when there is a search term */}
        {searchTerm && (
          <div className="mt-6">
            {filteredContacts.length > 0 ? ( 
              <ul className="list-none">
                {filteredContacts.map((contact) => (
                  <li key={contact.id} className="p-3 bg-[#deb992] mb-3 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">{contact.name}</h3>
                    <p>{contact.phoneNumber}</p>
                    <p>{contact.email}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#deb992]">No contacts found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
