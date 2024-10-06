import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Components/Home';
import ProtectedRoute from './Components/ProtectedRoute'; 
import SavedContacts from './Components/SavedContacts';
import ResetPassword from './Components/ResetPassword';
import OTPVerification from './Components/OTPVerification';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/savedContacts" element={<ProtectedRoute element={<SavedContacts />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
