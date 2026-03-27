import React from 'react';
import useStore from '../store/useStore';
import html2pdf from 'html2pdf.js';

const ProfilePreview = () => {
  const profileData = useStore((state) => state.profileData);

  const exportPDF = () => {
    const element = document.getElementById('resume-preview');
    html2pdf().from(element).save('resume.pdf');
  };

  if (!profileData) return <div className="p-8">No profile data available.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile Preview</h1>
        <button onClick={exportPDF} className="bg-green-600 text-white px-4 py-2 rounded">
          Export to PDF
        </button>
      </div>
      
      <div id="resume-preview" className="bg-white p-8 border rounded shadow">
        <h2 className="text-xl font-bold mb-2">Professional Summary</h2>
        <p className="mb-6">{profileData.summary}</p>

        <h2 className="text-xl font-bold mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {profileData.skills?.map((skill, index) => (
            <span key={index} className="bg-gray-200 px-2 py-1 rounded text-sm">{skill}</span>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-2">Experience</h2>
        <div>
          {profileData.experiences?.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">{exp.job_title} at {exp.company}</h3>
              <p className="text-gray-700 mt-1">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;