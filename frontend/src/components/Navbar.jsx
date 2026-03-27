import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">AI Recruiter</Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            {user.role === 'candidate' && (
              <>
                <Link to="/builder" className="text-gray-600 hover:text-blue-600 font-semibold">AI Builder</Link>
                <Link to="/editor" className="text-gray-600 hover:text-blue-600 font-semibold">Manual Editor</Link>
                <Link to="/preview" className="text-gray-600 hover:text-blue-600 font-semibold">Preview Resume</Link>
              </>
            )}
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 font-semibold ml-4">
              Logout ({user.email})
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;