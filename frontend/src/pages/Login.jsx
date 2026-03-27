import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import useStore from '../store/useStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
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
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
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
          className="w-full mb-6 p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mb-4">
          Login
        </button>
        <p className="text-center text-sm text-gray-600">
          Need an account? <Link to="/signup" className="text-blue-600">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;