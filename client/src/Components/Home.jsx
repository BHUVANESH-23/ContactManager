import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [signup, setSignup] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
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
      } finally {
        setLoading(false); // Set loading to false when data is fetched
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/signup');
        setSignup(res.data);
        console.log(res.data);
      } catch (error) {
        console.error('Error fetching Users:', error);
      }
    };

    fetchContacts();
    fetchUsers();
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

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
    contact.phoneNumber.startsWith(searchTerm)
  );

  const userMail = localStorage.getItem('userEmail');
  const user = signup.find(user => user.email === userMail);
  const welcomeMessage = user ? `Welcome  ${user.firstName} ${user.lastName}` : '';

  return (
    <div className="bg-[#051622] min-h-screen flex flex-col items-center py-5">
      <header className="w-full bg-[#051622] py-4 fixed top-0 left-0 z-10 shadow-lg">
        <nav className="flex justify-between items-center max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-xl md:text-2xl font-bold text-[#deb992]">Contact Manager</div>

          {/* Navbar links for desktop */}
          <div className="hidden lg:flex space-x-8 items-center">
            <Link to={'/savedContacts'} className="hover:underline text-[#1ba098] hover:text-white">Saved Contacts</Link>
            <Link to={'/addContact'} className="hover:underline text-[#1ba098] hover:text-white">Add Contact</Link>
            <button onClick={handleGoogle} className="hover:underline text-[#1ba098] hover:text-white flex items-center">
              <FaGoogle className="mr-1" />
              Add from Google
            </button>
            <div onClick={handleLogout} className="hover:underline text-[#1ba098] cursor-pointer hover:text-white">Log Out</div>
            <div className="relative hidden lg:block">
              <CiSearch className="absolute left-3 top-2 w-6 h-6 text-[#1ba098]" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border rounded-lg p-2 pl-10 pr-2 text-black text-sm md:text-base lg:text-lg"
                placeholder="Search Contacts"
              />
            </div>
          </div>

          {/* Hamburger menu for mobile and tablet */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#deb992] p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </nav>

        {/* Dropdown menu for mobile and tablet, with search bar included */}
        {isMenuOpen && (
          <ul className="lg:hidden flex flex-col items-center space-y-4 bg-[#051622] pt-4 pb-4 shadow-md absolute top-full left-0 w-full">
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
            <li>
              <div className="hover:underline text-[#1ba098] cursor-pointer hover:text-white" onClick={handleLogout}>Log Out</div>
            </li>
            <li className="flex items-center w-full px-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border rounded-lg p-2 pl-10 pr-2 text-black w-full"
                placeholder="Search Contacts"
              />
            </li>
          </ul>
        )}
      </header>

      {/* Show loading message if loading state is true */}
      {loading ? (
        <div className='text-[#deb992] text-lg md:text-xl mt-20'>Loading...</div>
      ) : (
        <>
          {welcomeMessage && <div className='text-[#deb992] text-lg md:text-xl mt-24'>{welcomeMessage}</div>}

          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-5 mt-12 max-w-lg md:max-w-2xl lg:max-w-4xl">
            {message && <div className='text-[#1ba098] mb-4 text-sm md:text-base'>{message}</div>}
            <div className="flex justify-around mb-16 flex-wrap gap-4">
              <button
                onClick={() => navigate('/addContact')}
                className="bg-[#deb992] text-black px-6 py-2 md:px-8 md:py-3 lg:px-10 lg:py-4 rounded-lg hover:bg-[#c8a063] transition text-sm md:text-base lg:text-lg w-full md:w-auto"
              >
                Add Contact
              </button>
              <button
                onClick={() => navigate('/savedContacts')}
                className="bg-[#deb992] text-black px-6 py-2 md:px-8 md:py-3 lg:px-10 lg:py-4 rounded-lg hover:bg-[#c8a063] transition text-sm md:text-base lg:text-lg w-full md:w-auto"
              >
                Saved Contacts
              </button>
            </div>

            <div className="mt-6 overflow-x-auto">
              {filteredContacts.length > 0 ? (
                <table className="min-w-full bg-[#f3d3b1] rounded-lg shadow-md text-sm md:text-base">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 md:py-3 md:px-5 text-left font-semibold text-[#1ba098]">Name</th>
                      <th className="py-2 px-4 md:py-3 md:px-5 text-left font-semibold text-[#1ba098]">Phone Number</th>
                      <th className="py-2 px-4 md:py-3 md:px-5 text-left font-semibold text-[#1ba098]">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact) => (
                      <tr key={contact.id} className="border-b border-[#c8a063] cursor-pointer" onClick={() => navigate('/savedContacts')}>
                        <td className="py-2 px-4 md:py-3 md:px-5">{contact.name}</td>
                        <td className="py-2 px-4 md:py-3 md:px-5">{contact.phoneNumber}</td>
                        <td className="py-2 px-4 md:py-3 md:px-5">{contact.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-[#deb992] text-sm md:text-base">No contacts found.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
