import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecruiterDashboard = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/profiles');
        setProfiles(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfiles();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Recruiter Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div key={profile.id} className="border p-4 rounded shadow bg-white">
            <h2 className="text-xl font-semibold">{profile.email}</h2>
            <p className="mt-2 text-sm text-gray-600">{profile.summary}</p>
            <div className="mt-4">
              <h3 className="font-bold text-sm">Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills && profile.skills.map((skill) => (
                  <span key={skill.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {skill.skill_name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterDashboard;