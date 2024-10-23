import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoPersonOutline } from "react-icons/io5";
import { CiEdit, CiSaveDown2 } from "react-icons/ci";

const SavedContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [editingContactId, setEditingContactId] = useState(null);
  const [editedContact, setEditedContact] = useState({
    name: '',
    phoneNumber: '',
    email: ''
  });
  const [selectedContacts, setSelectedContacts] = useState([]); // For tracking selected contacts
  const [isDeleteMode, setIsDeleteMode] = useState(false); // For delete mode

  useEffect(() => {
    const fetchContacts = async () => {
      const userMail = localStorage.getItem('userEmail');
      try {
        const response = await axios.get('http://localhost:5000/api/contact', {
          headers: { userMail }
        });
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  const handleEditClick = (contact) => {
    setEditingContactId(contact._id);
    setEditedContact(contact);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedContact((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/contact/${editingContactId}`, editedContact);
      setContacts((prevContacts) => prevContacts.map((contact) =>
        contact._id === editingContactId ? editedContact : contact
      ));
      setEditingContactId(null);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleSelectContact = (id) => {
    setSelectedContacts((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(selectedId => selectedId !== id); // Deselect
      } else {
        return [...prevSelected, id]; // Select
      }
    });
  };

  const handleDeleteModeToggle = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedContacts([]); // Reset selected contacts when toggling delete mode
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedContacts.map(id => axios.delete(`http://localhost:5000/api/contact/${id}`)));
      setContacts(contacts.filter(contact => !selectedContacts.includes(contact._id))); // Remove deleted contacts from state
      setSelectedContacts([]); // Reset selected contacts after deletion
      setIsDeleteMode(false); // Exit delete mode
    } catch (error) {
      console.error('Error deleting selected contacts:', error);
    }
  };

  return (
    <div className="bg-[#051622] min-h-screen flex flex-col items-center py-5">
      <header className="w-full bg-[#051622] py-4 fixed top-0 left-0 z-10 shadow-lg">
        <nav className="flex justify-between items-center max-w-4xl mx-auto px-5">
          <div className="text-2xl font-bold text-[#deb992]">Contact List</div>
          {isDeleteMode ? (
            <button onClick={handleDeleteSelected} className="bg-red-600 text-white px-3 py-1  rounded-md shadow-md hover:bg-red-700">
              Delete Selected
            </button>
          ) : (
            <button onClick={handleDeleteModeToggle} className="bg-[#deb992] text-[#051622] px-3 py-1 rounded-sm shadow-md hover:bg-[#c8a063]">
              Delete Contacts
            </button>
          )}
        </nav>
      </header>

      <div className="container mx-auto px-5 py-5 mt-20 max-w-4xl">
        <h2 className="text-xl font-semibold mb-4 text-[#deb992]">Saved Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contacts.map(contact => (
            <div key={contact._id} className="bg-[#deb992] p-4 rounded-lg shadow-md hover:shadow-lg">
              {editingContactId === contact._id ? (
                <form>
                  <div className="flex items-center mb-2">
                    <IoPersonOutline className="text-[#051622]" size={24} />
                    <input
                      type="text"
                      name="name"
                      value={editedContact.name}
                      onChange={handleInputChange}
                      className="ml-2 p-1 border rounded w-full"
                    />
                  </div>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editedContact.phoneNumber}
                    onChange={handleInputChange}
                    className="mb-2 p-1 border rounded w-full"
                  />
                  <input
                    type="text"
                    name="email"
                    value={editedContact.email}
                    onChange={handleInputChange}
                    className="mb-2 p-1 border rounded w-full"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleEditSubmit}
                      className="bg-[#051622] text-white flex items-center px-3 py-1 rounded-lg shadow-md hover:bg-[#1b2d3a]"
                    >
                      <CiSaveDown2 className="mr-1" size={15} /> 
                      
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center mb-2">
                    <IoPersonOutline className="text-[#051622]" size={24} />
                    <h3 className="text-lg font-bold text-[#051622] ml-2">{contact.name}</h3>
                  </div>
                  <p className="text-[#051622]"><strong>Phone:</strong> {contact.phoneNumber}</p>
                  <p className="text-[#051622]"><strong>Email:</strong> {contact.email}</p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEditClick(contact)}
                      className="mt-2 bg-[#051622] text-white flex items-center px-3 py-1 rounded-lg shadow-md hover:bg-[#1b2d3a]"
                    >
                      <CiEdit className="mr-1" size={15} />
                      
                    </button>
                    {isDeleteMode && (
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact._id)}
                        onChange={() => handleSelectContact(contact._id)}
                        className="ml-2"
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedContacts;
