import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoPersonOutline } from "react-icons/io5";

const SavedContacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const userMail = localStorage.getItem('userEmail'); // Get userMail from localStorage
      try {
        const response = await axios.get('http://localhost:5000/api/contact', {
          headers: { userMail }  // Send userMail in the headers
        });
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="bg-[#051622] min-h-screen flex flex-col items-center py-5">
      <header className="w-full bg-[#051622] py-4 fixed top-0 left-0 z-10 shadow-lg">
        <nav className="flex justify-between items-center max-w-4xl mx-auto px-5">
          <div className="text-2xl font-bold text-[#deb992]">Contact List</div>
        </nav>
      </header>

      <div className="container mx-auto px-5 py-5 mt-20 max-w-4xl">
        <h2 className="text-xl font-semibold mb-4 text-[#deb992]">Saved Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contacts.map(contact => (
            <div key={contact._id} className="bg-[#deb992] p-4 rounded-lg shadow-md hover:shadow-lg">
              {/* Flex container for icon and text */}
              <div className="flex items-center mb-2">
                {/* Icon aligned and sized */}
                <IoPersonOutline className="text-[#051622]" size={24} />
                {/* Spacing between icon and name */}
                <h3 className="text-lg font-bold text-[#051622] ml-2">{contact.name}</h3>
              </div>
              <p className="text-[#051622]"><strong>Phone:</strong> {contact.phoneNumber}</p>
              <p className="text-[#051622]"><strong>Email:</strong> {contact.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedContacts;
