import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Navbar from "./pages/Navbar.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Matches from "./pages/Matches.jsx";
import Profile from "./pages/Profile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import RateExperience from "./pages/RateExperience.jsx";
import Messages from "./pages/Messages.jsx";
import MessagesList from "./pages/MessagesList.jsx";
import UserProfile from './pages/UserProfile.jsx'; 

import "bootstrap/dist/css/bootstrap.min.css";


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/", "/register", "/complete-profile", "/login"];
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/users/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/rate/:id" element={<ProtectedRoute><RateExperience /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MessagesList /></ProtectedRoute>} />
        <Route path="/messages/:userId" element={<ProtectedRoute><Messages /></ProtectedRoute>} /> 
        <Route path="/chat/:userId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;