import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client.js'; 
import { TrendingUp, Users, MessageSquare, Star, Search, UserCircle, ArrowUpRight, Rocket } from 'lucide-react'; 
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [conversationsCount, setConversationsCount] = useState(0); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = axiosClient.get('/user');
    const fetchMatches = axiosClient.get('/matches');
    const fetchMessages = axiosClient.get('/messages');

    Promise.all([fetchUserData, fetchMatches, fetchMessages])
      .then(([userRes, matchesRes, messagesRes]) => {
        setUser(userRes.data);
        setMatches(matchesRes.data.slice(0, 3)); 
        setConversationsCount(messagesRes.data.length);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      });
  }, []);

  const stats = [
    { label: 'Skills Offered', value: user?.offered_skills?.length || 0, icon: <Rocket size={20} />, bg: 'bg-primary-subtle', color: 'text-primary' },
    { label: 'Active Matches', value: matches.length, icon: <Users size={20} />, bg: 'bg-success-subtle', color: 'text-success' },
    { label: 'Messages', value: conversationsCount, icon: <MessageSquare size={20} />, bg: 'bg-info-subtle', color: 'text-info' },
    { label: 'Average Rating', value: '5.0', icon: <Star size={20} />, bg: 'bg-warning-subtle', color: 'text-warning' }
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
        <div className="spinner-grow text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container py-4">
      <div className="container">
        {/* Header */}
        <header className="mb-5">
          <h1 className="fw-black text-dark mb-1">Welcome back, {user?.name || 'User'}! 👋</h1>
          <p className="text-muted fw-medium">Ready to exchange some skills today?</p>
        </header>

        {/* Stats Cards*/}
        <div className="row g-4 mb-5">
          {stats.map((stat, idx) => (
            <div key={idx} className="col-md-3">
              <div className="stat-card shadow-sm border-0 bg-white p-4 rounded-5">
                <div className={`icon-box-wrapper ${stat.bg} ${stat.color} mb-3`}>
                  {stat.icon}
                </div>
                <h3 className="fw-bold m-0">{stat.value}</h3>
                <span className="text-muted small fw-bold">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Recent Matches */}
          <div className="col-lg-7">
            <div className="bg-white p-4 rounded-5 shadow-sm border-0 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold m-0 text-dark">Recent Matches</h5>
                <button onClick={() => navigate('/matches')} className="btn btn-sm btn-light rounded-pill px-3 fw-bold">View All</button>
              </div>
              
              <div className="d-flex flex-column gap-2">
                {matches.length > 0 ? matches.map((item, index) => (
                  <div key={index} className="match-item d-flex align-items-center transition-all" onClick={() => navigate(`/users/${item.id}`)}>
                    <div className="avatar-initials me-3 text-white fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                      {item.name.charAt(0)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold text-dark">{item.name}</div>
                      <div className="text-muted small">Offers: {item.offered_skills?.map(s => s.name).join(', ')}</div>
                    </div>
                    <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2 border-0">Perfect Match</span>
                  </div>
                )) : (
                  <div className="text-center py-4">
                    <p className="text-muted small">No matches found yet. Try adding more skills!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

         
          {/* Quick Actions */}
          <div className="col-lg-5">
            <div className="quick-actions-container p-4 rounded-5 shadow-lg h-100">
              <h5 className="fw-bold mb-4 text-white">Quick Actions</h5>
              
              <div className="d-flex flex-column gap-3">
                {/* Find New Matches */}
                <div className="action-card-dark d-flex align-items-center gap-3 transition-all" onClick={() => navigate('/matches')}>
                  <div className="icon-sq-dark"><Search size={20} /></div>
                  <div className="flex-grow-1">
                    <div className="fw-bold small text-white">Find New Matches</div>
                    <div className="text-white-50 extra-small">Discover people for skill exchange</div>
                  </div>
                  <ArrowUpRight size={16} className="text-white-50" />
                </div>

                {/* View Messages */}
                <div className="action-card-dark d-flex align-items-center gap-3 transition-all" onClick={() => navigate('/messages')}>
                  <div className="icon-sq-dark"><MessageSquare size={20} /></div>
                  <div className="flex-grow-1">
                    <div className="fw-bold small text-white">View Messages</div>
                    <div className="text-white-50 extra-small">Continue your chats</div>
                  </div>
                  <ArrowUpRight size={16} className="text-white-50" />
                </div>

                {/* Update Profile */}
                <div className="action-card-dark d-flex align-items-center gap-3 transition-all" onClick={() => navigate('/profile')}>
                  <div className="icon-sq-dark"><UserCircle size={20} /></div>
                  <div className="flex-grow-1">
                    <div className="fw-bold small text-white">Update Profile</div>
                    <div className="text-white-50 extra-small">Manage your skills and bio</div>
                  </div>
                  <ArrowUpRight size={16} className="text-white-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;