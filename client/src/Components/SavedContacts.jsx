import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoPersonOutline } from "react-icons/io5";
import { CiEdit, CiSaveDown2 } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

const SavedContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [editingContactId, setEditingContactId] = useState(null);
  const [editedContact, setEditedContact] = useState({
    name: '',
    phoneNumber: '',
    email: ''
  });

  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [contactInfoArray, setContactInfoArray] = useState([]);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Shared Contacts');
  const [body, setBody] = useState('Here are the shared contacts:');
  const [share, setShare] = useState(false)


  const navigator = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      const userMail = localStorage.getItem('userEmail');
      try {
        const response = await axios.get('https://contactmanager-yvwy.onrender.com/api/contact', {
          headers: { userMail }
        });
        setContacts(response.data);

        const infoArray = response.data.map(contact => {
          const contactInfo = { name: contact.name, phone: contact.phoneNumber };
          if (contact.email && contact.email !== "No Email") {
            contactInfo.email = contact.email;
          }
          return contactInfo;
        });
        setContactInfoArray(infoArray);

      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleShare = async (e) => {
    e.preventDefault();

    setShare((prev) => !prev)

    const formattedContacts = contactInfoArray.map(contact => {
      return `Name: ${contact.name}\nPhone: ${contact.phone}${contact.email ? `\nEmail: ${contact.email}` : ''}`;
    }).join('\n\n');

    const blob = new Blob([formattedContacts], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', blob, 'contacts.txt');
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('body', body);

    try {
      const response = await axios.post('https://contactmanager-yvwy.onrender.com/api/send-mail', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Contacts sent successfully!');
      setEmail('')
      setSubject('')
      setBody('')
    } catch (error) {
      console.error('Error sharing contacts:', error);

    }
  };

  const handleEditClick = (contact) => {
    setEditingContactId(contact._id);
    setEditedContact(contact);
  };

  const handleDownloadContacts = () => {
    const contactText = contactInfoArray.map(contact => {
      return `Name: ${contact.name}\nPhone: ${contact.phone}${contact.email ? `\nEmail: ${contact.email}` : ''}`;
    }).join('\n\n');

    const blob = new Blob([contactText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contacts.txt';
    link.click();
    URL.revokeObjectURL(url);
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
      await axios.put(`https://contactmanager-yvwy.onrender.com/api/contact/${editingContactId}`, editedContact);
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
        return prevSelected.filter(selectedId => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleDeleteModeToggle = () => {
    setIsDeleteMode((prevMode) => !prevMode);
    setSelectedContacts([]);
  };

  const handleDeleteSelected = async () => {
    if (selectedContacts.length === 0) {
      alert("No contacts selected for deletion!");
      return;
    }

    try {

      await Promise.all(selectedContacts.map((id) => axios.delete(`https://contactmanager-yvwy.onrender.com/api/contact/${id}`)));

      setContacts((prevContacts) => prevContacts.filter(contact => !selectedContacts.includes(contact._id)));
      setSelectedContacts([]);
      setIsDeleteMode(false);
    } catch (error) {
      console.error("Error deleting selected contacts:", error);
    }
  };

  const handleDeleteAll = async () => {
    const confirmation = window.confirm("Are you sure you want to delete all contacts?");
    if (!confirmation) return;

    try {
      const userMail = localStorage.getItem('userEmail');
      if (!userMail) {
        alert('User email is missing!');
        return;
      }


      const allContactIds = contacts.map(contact => contact._id);

      if (allContactIds.length === 0) {
        alert("No contacts to delete.");
        return;
      }


      await axios.delete('https://contactmanager-yvwy.onrender.com/api/del', {
        headers: {
          'usermail': userMail
        },
        data: { ids: allContactIds }
      });


      setContacts([]);
      setIsDeleteMode(false);
      alert("All contacts have been deleted!");

    } catch (error) {
      console.error("Error deleting all contacts:", error);
      alert("Failed to delete all contacts.");
    }
  };

  return (
    <div className="bg-[#051622] min-h-screen flex flex-col items-center py-5">
      <header className="w-full bg-[#051622] py-4 fixed top-0 left-0 z-10 shadow-lg">
        <nav className="flex justify-between items-center max-w-4xl mx-auto px-5">
          <div className="text-2xl font-bold text-[#deb992] cursor-pointer" onClick={() => navigator('/')}>
            Contact List
          </div>

          {isDeleteMode ? (
            <div>
              <button onClick={handleDeleteSelected} className="bg-red-600 text-white px-3 py-1  rounded-md shadow-md hover:bg-red-700">
                Delete Selected
              </button>
              <button
                onClick={handleDeleteAll}
                className="bg-red-600 text-white px-3 py-1 ml-3 rounded-md shadow-md hover:bg-red-800"
              >
                Delete All
              </button>
            </div>
          ) : (
            <>
              <div>
                <button onClick={handleDeleteModeToggle} className="bg-[#deb992] text-[#051622] mr-5 px-3 py-1 rounded-sm shadow-md hover:bg-[#c8a063]">
                  Delete Contacts
                </button>
                <button onClick={handleShare} className="bg-[#deb992] text-[#051622] px-3 mr-5 py-1 rounded-sm shadow-md hover:bg-[#c8a063]">
                  Share
                </button>
                <button onClick={handleDownloadContacts} className="bg-[#deb992] text-[#051622] px-3 py-1 rounded-sm shadow-md hover:bg-[#c8a063]">
                  Download Contacts
                </button>

              </div>
            </>
          )}
        </nav>
      </header>

      {share && <div className="bg-[#deb992] p-5 rounded-lg shadow-md mt-16">
        <form onSubmit={handleShare} >
          <div className="m-4">
            <label htmlFor="email" className="text-[#deb992]">Recipient Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              className="mt-1 p-2 border rounded w-full"
              required
              placeholder="Enter the recipient's email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="subject" className="text-[#deb992]">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter the subject of the email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="body" className="text-[#deb992]">Body:</label>
            <textarea
              id="body"
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter the body of the email"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-[#deb992] text-[#051622] px-3 py-1 rounded-sm shadow-md hover:bg-[#c8a063]"
            >
              Share
            </button>
          </div>
        </form>
      </div>}

      <div className="container mx-auto px-5 py-5 mt-20 max-w-4xl">
        <h2 className="text-xl font-semibold mb-4 text-[#deb992]">Saved Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contacts.map(contact => (
            <div
              key={contact._id}
              className={`bg-[#deb992] p-4 rounded-lg shadow-md hover:shadow-lg ${isDeleteMode && selectedContacts.includes(contact._id) ? 'border-2 border-red-600' : ''
                }`}
              onClick={() => handleSelectContact(contact._id)}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{contact.name}</h3>
                  <p className="text-gray-700">Phone: {contact.phoneNumber}</p>
                  <p className="text-gray-700">Email: {contact.email}</p>
                </div>

                <div className="flex">
                  {isDeleteMode ? (
                    <button
                      onClick={() => handleSelectContact(contact._id)}
                      className={`text-red-600 ${selectedContacts.includes(contact._id) ? 'font-bold' : ''}`}
                    >
                      {selectedContacts.includes(contact._id) ? 'Deselect' : 'Select'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(contact)}
                      className="text-[#deb992] hover:text-[#051622] ml-2"
                    >
                      <CiEdit size={20} />
                    </button>
                  )}
                </div>
              </div>

              {editingContactId === contact._id && (
                <div className="mt-4">
                  <form onSubmit={handleEditSubmit}>
                    <input
                      type="text"
                      name="name"
                      value={editedContact.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                      className="w-full mb-2 p-2 rounded-md"
                    />
                    <input
                      type="text"
                      name="phoneNumber"
                      value={editedContact.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="w-full mb-2 p-2 rounded-md"
                    />
                    <input
                      type="email"
                      name="email"
                      value={editedContact.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="w-full mb-2 p-2 rounded-md"
                    />
                    <button
                      type="submit"
                      className="bg-[#deb992] text-[#051622] px-3 py-1 rounded-sm shadow-md hover:bg-[#c8a063] mt-2"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}



    </div>
  );
};

export default SavedContacts;
