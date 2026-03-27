import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useStore from '../store/useStore';

const ProfileEditor = () => {
  const { user, profileData, setProfileData } = useStore();
  const [saveStatus, setSaveStatus] = useState('');
  const [localData, setLocalData] = useState(profileData);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/profiles/me/${user.id}`);
        if (res.data) {
          setLocalData(res.data);
          setProfileData(res.data);
        }
      } catch (err) {}
    };
    fetchProfile();
  }, [user]);

  const triggerAutoSave = useCallback(async (dataToSave) => {
    if (!user?.id) return;
    setSaveStatus('Saving...');
    try {
      await axios.put('http://localhost:5000/api/profiles/autosave', {
        userId: user.id,
        ...dataToSave
      });
      setProfileData(dataToSave);
      setSaveStatus('Profile saved');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setSaveStatus('Error saving');
    }
  }, [user, setProfileData]);

  const handleChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
  };

  const handleArrayChange = (field, index, subfield, value) => {
    const newArray = [...(localData[field] || [])];
    newArray[index] = { ...newArray[index], [subfield]: value };
    const updatedData = { ...localData, [field]: newArray };
    setLocalData(updatedData);
  };

  const addItem = (field, emptyItem) => {
    const updatedData = { ...localData, [field]: [...(localData[field] || []), emptyItem] };
    setLocalData(updatedData);
  };

  const removeItem = (field, index) => {
    const newArray = [...(localData[field] || [])];
    newArray.splice(index, 1);
    const updatedData = { ...localData, [field]: newArray };
    setLocalData(updatedData);
    triggerAutoSave(updatedData);
  };

  const handleBlur = () => {
    triggerAutoSave(localData);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manual Profile Editor</h1>
        {saveStatus && <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded">{saveStatus}</span>}
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <textarea
          className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
          rows="4"
          value={localData.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
          onBlur={handleBlur}
        />
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          <button onClick={() => addItem('skills', { skill_name: '' })} className="text-blue-600 font-semibold">+ Add Skill</button>
        </div>
        {localData.skills?.map((skill, index) => (
          <div key={index} className="flex gap-4 mb-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded"
              placeholder="Skill"
              value={skill.skill_name || skill || ''}
              onChange={(e) => {
                const newSkills = [...localData.skills];
                newSkills[index] = { skill_name: e.target.value };
                handleChange('skills', newSkills);
              }}
              onBlur={handleBlur}
            />
            <button onClick={() => removeItem('skills', index)} className="text-red-500">Remove</button>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Experience</h2>
          <button onClick={() => addItem('experiences', { job_title: '', company: '', description: '' })} className="text-blue-600 font-semibold">+ Add Experience</button>
        </div>
        {localData.experiences?.map((exp, index) => (
          <div key={index} className="border p-4 rounded mb-4 bg-gray-50">
            <input className="w-full mb-2 p-2 border rounded" placeholder="Job Title" value={exp.job_title || ''} onChange={(e) => handleArrayChange('experiences', index, 'job_title', e.target.value)} onBlur={handleBlur} />
            <input className="w-full mb-2 p-2 border rounded" placeholder="Company" value={exp.company || ''} onChange={(e) => handleArrayChange('experiences', index, 'company', e.target.value)} onBlur={handleBlur} />
            <textarea className="w-full mb-2 p-2 border rounded" placeholder="Description" rows="3" value={exp.description || ''} onChange={(e) => handleArrayChange('experiences', index, 'description', e.target.value)} onBlur={handleBlur} />
            <button onClick={() => removeItem('experiences', index)} className="text-red-500 text-sm font-semibold">Remove Experience</button>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Education</h2>
          <button onClick={() => addItem('education', { institution: '', degree: '' })} className="text-blue-600 font-semibold">+ Add Education</button>
        </div>
        {localData.education?.map((edu, index) => (
          <div key={index} className="border p-4 rounded mb-4 bg-gray-50 flex gap-4">
            <input className="flex-1 p-2 border rounded" placeholder="Institution" value={edu.institution || ''} onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)} onBlur={handleBlur} />
            <input className="flex-1 p-2 border rounded" placeholder="Degree" value={edu.degree || ''} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} onBlur={handleBlur} />
            <button onClick={() => removeItem('education', index)} className="text-red-500">Remove</button>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Projects</h2>
          <button onClick={() => addItem('projects', { project_name: '', description: '', link: '' })} className="text-blue-600 font-semibold">+ Add Project</button>
        </div>
        {localData.projects?.map((proj, index) => (
          <div key={index} className="border p-4 rounded mb-4 bg-gray-50">
            <input className="w-full mb-2 p-2 border rounded" placeholder="Project Name" value={proj.project_name || ''} onChange={(e) => handleArrayChange('projects', index, 'project_name', e.target.value)} onBlur={handleBlur} />
            <textarea className="w-full mb-2 p-2 border rounded" placeholder="Description" rows="2" value={proj.description || ''} onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)} onBlur={handleBlur} />
            <input className="w-full mb-2 p-2 border rounded" placeholder="Link" value={proj.link || ''} onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)} onBlur={handleBlur} />
            <button onClick={() => removeItem('projects', index)} className="text-red-500 text-sm font-semibold">Remove Project</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileEditor;