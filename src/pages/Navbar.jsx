import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, MessageCircle, 
  UserCircle, LogOut, Bell, User, Home, Zap 
} from 'lucide-react'; 
import axiosClient from '../axios-client';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0); 
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const updateAppData = useCallback(async () => {
    try {
      const [notifRes, msgRes] = await Promise.all([
        axiosClient.get('/notifications'),
        axiosClient.get('/messages') 
      ]);
      setNotifications(notifRes.data.all || []);
      setUnreadCount(notifRes.data.unread?.length || 0);
      
      const totalUnreadMsg = msgRes.data.filter(chat => chat.unread_count > 0).length;
      setUnreadMessages(totalUnreadMsg);
    } catch (err) { 
      console.error("Sync Error:", err); 
    }
  }, []);

  useEffect(() => {
    updateAppData();
    window.addEventListener('refreshAppData', updateAppData);
    const interval = setInterval(updateAppData, 15000); 
    return () => {
        clearInterval(interval);
        window.removeEventListener('refreshAppData', updateAppData);
    };
  }, [updateAppData]);

  const markNotificationsAsRead = async () => {
    try {
      await axiosClient.post('/notifications/read-all');
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const handleNav = (path) => {
    setShowNotifications(false);
    setShowProfileMenu(false);
    if(path === '/messages') setUnreadMessages(0);
    navigate(path);
  };

  const onLogout = (ev) => {
    ev.preventDefault();
    axiosClient.post('/logout')
      .finally(() => {
        localStorage.removeItem('ACCESS_TOKEN');
        window.location.href = '/login';
      });
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-custom shadow-sm">
      <div className="container px-4 d-flex justify-content-between align-items-center">
        
        <div className="nav-logo-area" style={{cursor:'pointer'}} onClick={() => handleNav('/dashboard')}>
          <div className="logo-bg"><Users size={20} className="text-white" /></div>
          <span className="fw-bold fs-5 mb-0 ms-2 d-none d-sm-inline">SkillSwap</span>
        </div>

        <div className="d-flex align-items-center gap-2 gap-md-3">
          
          {/* dashboard*/}
          <button 
            className={`action-icon-btn ${location.pathname === '/dashboard' ? 'active-link' : ''}`} 
            onClick={() => handleNav('/dashboard')}
            title="Home"
          >
            <Home size={22} />
          </button>

          {/* matches*/}
          <button 
            className={`action-icon-btn ${location.pathname === '/matches' ? 'active-link' : ''}`} 
            onClick={() => handleNav('/matches')}
            title="Matches"
          >
            <Zap size={22} />
          </button>

          {/* messages*/}
          <button 
            className={`action-icon-btn position-relative ${location.pathname === '/messages' ? 'active-link' : ''}`} 
            onClick={() => handleNav('/messages')}
            title="Messages"
          >
            <MessageCircle size={22} />
            {unreadMessages > 0 && <span className="msg-badge">{unreadMessages > 9 ? '9+' : unreadMessages}</span>}
          </button>
          
          {/* Notifications */}
          <div className="position-relative">
            <button className="action-icon-btn" onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications && unreadCount > 0) markNotificationsAsRead();
            }}>
              <Bell size={22} />
              {unreadCount > 0 && <span className="notif-badge" />}
            </button>
            {showNotifications && (
              <div className="dropdown-menu show shadow-lg border-0 position-absolute end-0 mt-2" style={{ width: '300px', borderRadius: '12px', zIndex: 1000 }}>
                <div className="p-3 fw-bold border-bottom">Notifications</div>
                <div className="notification-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.length > 0 ? notifications.map(n => (
                    <div key={n.id} className="p-3 border-bottom small hover-bg-light">{n.data.message}</div>
                  )) : <div className="p-4 text-center text-muted small">No new updates</div>}
                </div>
              </div>
            )}
          </div>

          {/* user profile*/}
          <div className="position-relative ms-1">
            <div className="avatar-circle shadow-sm" style={{cursor:'pointer'}} onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <User size={20} />
            </div>
            {showProfileMenu && (
              <div className="dropdown-menu show shadow-lg border-0 position-absolute end-0 mt-2 py-2" style={{ width: '180px', borderRadius: '12px', zIndex: 1000 }}>
                <button onClick={() => handleNav('/profile')} className="dropdown-item d-flex align-items-center gap-3 py-2 small">
                  <UserCircle size={18} className="text-primary" /> My Profile
                </button>
                <div className="dropdown-divider"></div>
                <button onClick={onLogout} className="dropdown-item d-flex align-items-center gap-3 py-2 small text-danger fw-bold">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;