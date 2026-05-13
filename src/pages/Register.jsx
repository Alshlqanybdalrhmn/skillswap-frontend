import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosClient from '../axios-client.js';
import './Login.css'; 

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  // Refs لجلب البيانات من الـ Inputs
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    // إرسال البيانات للباك إند
    axiosClient.post('/signup', payload)
      .then(({ data }) => {
        setLoading(false);
        localStorage.setItem('ACCESS_TOKEN', data.token);
        localStorage.setItem('USER_NAME', data.user.name);
        navigate('/complete-profile');
      })
      .catch(err => {
        setLoading(false);
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div className="auth-wrapper">
      <div className="bg-bubbles">
        {[...Array(10)].map((_, i) => <div key={i} className="bubble"></div>)}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center w-100 z-1"
      >
        {/* Logo */}
        <div className="mb-4 d-flex align-items-center justify-content-center gap-2 logo-container" onClick={() => navigate('/')}>
          <div className="logo-icon">
            <Users size={24} />
          </div>
          <h2 className="logo-text">SkillSwap</h2>
        </div>

        <div className="auth-card mx-auto shadow-lg">
          <div className="auth-tabs mb-4">
            <button className="auth-tab inactive" onClick={() => navigate('/login')}>Login</button>
            <button className="auth-tab active">Register</button>
          </div>

          <h4 className="fw-bold mb-1">Create Account</h4>
          <p className="text-muted small mb-4">Join our community and start swapping skills.</p>

          {errors && (
            <motion.div initial={{ x: -10 }} animate={{ x: 0 }} className="alert alert-danger-custom">
              {Object.keys(errors).map(key => <div key={key}>{errors[key]}</div>)}
            </motion.div>
          )}

          <form onSubmit={handleRegister}>
            {/* Full Name */}
            <div className="mb-3 text-start">
              <label className="form-label-custom">Full Name</label>
              <div className="input-group-modern">
                <User className="input-icon-modern" size={18} />
                <input ref={nameRef} type="text" className="input-modern" placeholder="Name" required />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3 text-start">
              <label className="form-label-custom">Email Address</label>
              <div className="input-group-modern">
                <Mail className="input-icon-modern" size={18} />
                <input ref={emailRef} type="email" className="input-modern" placeholder="Email" required />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4 text-start">
              <label className="form-label-custom">Create Password</label>
              <div className="input-group-modern">
                <Lock className="input-icon-modern" size={18} />
                <input ref={passwordRef} type="password" className="input-modern" placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" className="btn-modern-submit" disabled={loading}>
              {loading ? <span className="loader"></span> : (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  Create Account <CheckCircle size={18} />
                </span>
              )}
            </button>
          </form>

          <p className="mt-4 small text-muted">
            By signing up, you agree to our <b>Terms of Service</b>.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;