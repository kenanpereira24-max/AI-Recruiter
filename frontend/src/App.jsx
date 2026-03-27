import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import AIBuilder from './pages/AIBuilder';
import ProfileEditor from './pages/ProfileEditor';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RecruiterDashboard from './pages/RecruiterDashboard';
import ProfilePreview from './pages/ProfilePreview';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/builder" element={<ProtectedRoute><AIBuilder /></ProtectedRoute>} />
          <Route path="/editor" element={<ProtectedRoute><ProfileEditor /></ProtectedRoute>} />
          <Route path="/preview" element={<ProtectedRoute><ProfilePreview /></ProtectedRoute>} />
          <Route path="/recruiter" element={<ProtectedRoute><RecruiterDashboard /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;