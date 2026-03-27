import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to AI-Powered Recruitment</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Say goodbye to PDF resumes. Build your structured professional profile using AI, or discover top candidates instantly.
      </p>
      <div className="flex gap-4">
        <Link to="/builder" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold">
          Build Your Profile
        </Link>
        <Link to="/login" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-lg font-semibold">
          Recruiter Login
        </Link>
      </div>
    </div>
  );
};

export default Landing;