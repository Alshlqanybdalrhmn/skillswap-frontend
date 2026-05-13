import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, Edit3, Save, X, Plus, User, BookOpen, Briefcase } from 'lucide-react';
import axiosClient from '../axios-client.js';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '' });

 
  const [avatarFile, setAvatarFile] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [allSkills, setAllSkills] = useState([]);
  const [modalType, setModalType] = useState('offered');
  const [selectedSkill, setSelectedSkill] = useState('');

  useEffect(() => {
    fetchProfile();
    axiosClient.get('/skills').then(({ data }) => setAllSkills(data));
  }, []);

  const fetchProfile = () => {
    axiosClient.get('/user')
      .then(({ data }) => {
        setUser(data);
        setFormData({ name: data.name, bio: data.bio || '' });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSave = () => {
    axiosClient.put('/user', formData)
      .then(() => {
        setIsEditing(false);
        fetchProfile();
        alert("Profile updated successfully!");
      })
      .catch(() => alert("Error updating profile"));
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;

    const data = new FormData();
    data.append("avatar", file);

    try {
      await axiosClient.post('/user/avatar', data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      fetchProfile(); 
    } catch (err) {
      alert("Error uploading image");
    }
  };

  const handleAddSkill = () => {
    if (!selectedSkill) return;
    const targetList = modalType === 'offered' ? user?.offered_skills : user?.desired_skills;
    const isDuplicate = targetList?.some(s => s.id === parseInt(selectedSkill));

    if (isDuplicate) {
        alert("This skill is already in your list!");
        return;
    }

    axiosClient.post('/user/skills', { skill_id: selectedSkill, type: modalType })
    .then(() => {
      setShowModal(false);
      setSelectedSkill('');
      fetchProfile(); 
    })
    .catch(err => alert(err.response?.data?.message || "Error adding skill"));
  };

  const handleDeleteSkill = (skillId) => {
    if(!window.confirm("Are you sure?")) return;
    axiosClient.delete(`/user/skills/${skillId}`).then(() => fetchProfile());
  };

  if (loading) return (
    <div className="loading-container">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 fw-bold">Loading Profile...</p>
    </div>
  );

  return (
    <div className="profile-page py-5">
      <div className="container">
        {/* Profile Header Section */}
        <div className="profile-main-card shadow-sm mb-4">
          <div className="profile-cover"></div>
          <div className="profile-content p-4">
            <div className="row align-items-end">
              <div className="col-md-auto text-center text-md-start">
                <div className="avatar-wrapper">

                  {/*  UPDATED AVATAR  */}
                  <label className="avatar-xl shadow-lg" style={{ cursor: "pointer" }}>
                    <input 
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setAvatarFile(file);
                        handleAvatarUpload(file);
                      }}
                    />

                    {avatarFile ? (
                      <img 
                        src={URL.createObjectURL(avatarFile)} 
                        className="w-100 h-100 rounded-circle"
                        alt="preview"
                      />
                    ) : user?.avatar ? (
                      <img 
                        src={`http://127.0.0.1:8000/storage/${user.avatar}`} 
                        className="w-100 h-100 rounded-circle"
                        alt="avatar"
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </label>

                </div>
              </div>
              <div className="col-md mt-3 mt-md-0">
                {isEditing ? (
                  <div className="edit-mode-container">
                    <input 
                        className="form-control form-control-lg mb-2 shadow-none border-primary" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        placeholder="Your Name"
                    />
                    <textarea 
                        className="form-control shadow-none border-primary" 
                        rows="2" 
                        value={formData.bio} 
                        onChange={e => setFormData({...formData, bio: e.target.value})} 
                        placeholder="Tell us about yourself..."
                    />
                  </div>
                ) : (
                  <div className="profile-info">
                    <h2 className="fw-black mb-1 text-dark">{user?.name}</h2>
                    <p className="text-muted mb-0 d-flex align-items-center gap-2">
                        <User size={16} /> {user?.bio || "No bio added yet. Tell people what you're about!"}
                    </p>
                  </div>
                )}
              </div>
              <div className="col-md-auto mt-3 mt-md-0">
                {isEditing ? (
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={handleSave}>
                        <Save size={18}/> Save
                    </button>
                    <button className="btn btn-light rounded-pill px-4 border" onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                ) : (
                  <button className="btn btn-edit-profile rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm" onClick={() => setIsEditing(true)}>
                      <Edit3 size={18}/> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="row g-4">
          {/* Skills Offered */}
          <div className="col-md-6">
            <div className="skill-card h-100 shadow-sm p-4 bg-white rounded-4 border-0">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-2">
                    <div className="icon-box bg-primary-subtle text-primary">
                        <Briefcase size={20} />
                    </div>
                    <h5 className="fw-bold m-0 text-dark">Skills I Teach</h5>
                </div>
                <button className="btn btn-add-skill shadow-sm" onClick={() => { setModalType('offered'); setShowModal(true); }}>
                    <Plus size={18} />
                </button>
              </div>
              <div className="skills-container d-flex flex-wrap gap-2">
                {user?.offered_skills?.length > 0 ? user.offered_skills.map(skill => (
                  <div key={skill.id} className="modern-skill-tag tag-primary animate-fadeIn">
                    {skill.name}
                    <button className="delete-tag-btn" onClick={() => handleDeleteSkill(skill.id)}>
                        <X size={14} />
                    </button>
                  </div>
                )) : (
                    <p className="text-muted small">No skills listed yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Skills Desired */}
          <div className="col-md-6">
            <div className="skill-card h-100 shadow-sm p-4 bg-white rounded-4 border-0">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-2">
                    <div className="icon-box bg-success-subtle text-success">
                        <BookOpen size={20} />
                    </div>
                    <h5 className="fw-bold m-0 text-dark">Skills I Want</h5>
                </div>
                <button className="btn btn-add-skill shadow-sm" onClick={() => { setModalType('desired'); setShowModal(true); }}>
                    <Plus size={18} />
                </button>
              </div>
              <div className="skills-container d-flex flex-wrap gap-2">
                {user?.desired_skills?.length > 0 ? user.desired_skills.map(skill => (
                  <div key={skill.id} className="modern-skill-tag tag-success animate-fadeIn">
                    {skill.name}
                    <button className="delete-tag-btn" onClick={() => handleDeleteSkill(skill.id)}>
                        <X size={14} />
                    </button>
                  </div>
                )) : (
                    <p className="text-muted small">Add skills you're looking for!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal إضافة مهارة */}
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="modal-content-card animate-zoomIn shadow-lg">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold m-0">Add New Skill</h5>
                <button className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
            </div>
            <label className="text-muted small fw-bold mb-2">Select a skill to add to your list</label>
            <select className="form-select form-select-lg mb-4 shadow-none border-2" value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
              <option value="">What skill is on your mind?</option>
              {allSkills.map(skill => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
            </select>
            <div className="d-flex gap-3 mt-2">
              <button className="btn btn-primary btn-lg w-100 rounded-pill shadow-sm" onClick={handleAddSkill}>Confirm & Add</button>
              <button className="btn btn-light btn-lg w-100 rounded-pill border" onClick={() => setShowModal(false)}>Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;