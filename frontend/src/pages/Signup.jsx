import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import useStore from '../store/useStore';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { email, password, role });
      setUser(res.data.user, res.data.token);
      if (res.data.user.role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/builder');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-6 p-2 border rounded"
        >
          <option value="candidate">Candidate</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded mb-4">
          Sign Up
        </button>
        <p className="text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;