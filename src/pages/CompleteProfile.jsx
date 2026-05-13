import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client.js'; 
import './CompleteProfile.css';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillsList, setSkillsList] = useState([]); 
  
  // States لحفظ ما يختاره المستخدم
  const [displayName, setDisplayName] = useState(localStorage.getItem('USER_NAME') || '');
  const [bio, setBio] = useState('');
  const [offeredSkillId, setOfferedSkillId] = useState('');
  const [desiredSkillId, setDesiredSkillId] = useState('');
  
  // States لرفع الصورة
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    axiosClient.get('/skills')
      .then(({ data }) => setSkillsList(data))
      .catch(err => console.error("Error fetching skills:", err));
  }, []);

  // التعامل مع اختيار الصورة
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // رفع الصورة
      if (avatar) {
        const formData = new FormData();
        formData.append('avatar', avatar);
        await axiosClient.post('/user/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // تحديث البيانات الشخصية والمهارات
      await axiosClient.put('/user', {
        name: displayName,
        bio: bio
      });

      //إضافة المهارة التي يعلمها
      if (offeredSkillId) {
        await axiosClient.post('/user/skills', {
          skill_id: offeredSkillId,
          type: 'offered'
        });
      }

    // إضافة المهارة التي يريد تعلمها
      if (desiredSkillId) {
        await axiosClient.post('/user/skills', {
          skill_id: desiredSkillId,
          type: 'desired'
        });
      }

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ البيانات، تأكد من ملء الحقول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container text-center">
      <h2 className="fw-bold mb-1">Complete Your Profile</h2>
      <p className="text-muted mb-4">Tell us about yourself and your skills</p>

      <div className="profile-card text-start">
        {/* قسم رفع الصورة المحدث */}
        <div className="text-center mb-4">
          <div 
            className="upload-circle shadow-sm" 
            onClick={() => document.getElementById('avatarInput').click()}
            style={{ cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee', borderRadius: '50%', width: '100px', height: '100px', margin: '0 auto' }}
          >
            {preview ? (
              <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '2rem' }}>📤</span>
            )}
          </div>
          <input 
            type="file" 
            id="avatarInput" 
            hidden 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          <button 
            type="button" 
            className="btn-upload mt-2" 
            onClick={() => document.getElementById('avatarInput').click()}
          >
            {preview ? "Change Photo" : "Upload Photo"}
          </button>
        </div>

        <form onSubmit={handleComplete}>
          <div className="mb-3">
            <label className="form-label fw-bold small">Display Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How should others see you?" 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold small">Bio</label>
            <textarea 
              className="form-control" 
              rows="4" 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..." 
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold small">Skill You Can Teach</label>
            <select 
              className="form-select" 
              value={offeredSkillId} 
              onChange={(e) => setOfferedSkillId(e.target.value)}
              required
            >
              <option value="">Select a skill...</option>
              {skillsList.map(skill => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small">Skill You Want to Learn</label>
            <select 
              className="form-select" 
              value={desiredSkillId} 
              onChange={(e) => setDesiredSkillId(e.target.value)}
              required
            >
              <option value="">Select a skill...</option>
              {skillsList.map(skill => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={loading}>
            {loading ? 'Saving...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;