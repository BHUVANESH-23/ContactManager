import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axiosInstance from './Components/AxiosInstance';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Components/Home';
import ProtectedRoute from './Components/ProtectedRoute'; 
import SavedContacts from './Components/SavedContacts';
import ResetPassword from './Components/ResetPassword';
import OTPVerification from './Components/OTPVerification';
import AddContact from './Components/AddContacts';
import EditContact from './Components/EditContact';

function App() {
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axiosInstance.get('/api/login/validateToken'); 
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userEmail');
          window.location.href = '/login'; 
        }
      }
    };

    validateToken(); // Call the validation function on app load
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/savedContacts" element={<ProtectedRoute element={<SavedContacts />} />} />
        <Route path="/addContact" element={<AddContact />} />
        <Route path="/edit-contact/:id" element={<EditContact />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
