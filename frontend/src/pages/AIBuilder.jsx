import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const AIBuilder = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, setProfileData } = useStore();

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    
    try {
      const aiResponse = await axios.post('http://localhost:5000/api/ai/parse', { text: input });
      
      const profilePayload = {
        userId: user?.id || 1, 
        summary: aiResponse.data.summary,
        skills: aiResponse.data.skills,
        experiences: aiResponse.data.experiences,
      };

      await axios.post('http://localhost:5000/api/profiles', profilePayload);
      setProfileData(profilePayload);
      navigate('/preview');
    } catch (err) {
      setError('Failed to process data. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto mt-10 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">AI Profile Builder</h1>
      <p className="mb-4 text-gray-600">Type your experience naturally. Our AI will structure it.</p>
      
      <textarea
        className="w-full p-4 border border-gray-300 rounded mb-4 h-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="E.g., I worked at Microsoft as a Frontend Engineer for 2 years using React and Node.js. I built the payment gateway..."
      />
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded w-full font-semibold transition-colors disabled:bg-blue-400"
      >
        {loading ? 'Structuring Profile via AI...' : 'Generate Structured Profile'}
      </button>
    </div>
  );
};

export default AIBuilder;