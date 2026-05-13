import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion'; 
import axiosClient from '../axios-client.js';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const emailRef = useRef();
  const passwordRef = useRef();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    axiosClient.post('/login', payload)
      .then(({ data }) => {
        setLoading(false);
        localStorage.setItem('ACCESS_TOKEN', data.token);
        localStorage.setItem('USER_NAME', data.user.name);
        navigate('/dashboard');
      })
      .catch(err => {
        setLoading(false);
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        } else if (response && response.status === 401) {
          setErrors({ email: [response.data.message] });
        } else {
          setErrors({ email: ["حدث خطأ في الاتصال بالسيرفر"] });
        }
      });
  };

  return (
    <div className="auth-wrapper">
      <div className="bg-bubbles">
        {[...Array(10)].map((_, i) => <div key={i} className="bubble"></div>)}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
            <button className="auth-tab active">Login</button>
            <button className="auth-tab inactive" onClick={() => navigate('/register')}>Register</button>
          </div>

          <h4 className="fw-bold mb-1">Welcome Back!</h4>
          <p className="text-muted small mb-4">Please enter your details to sign in.</p>

          {errors && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="alert alert-danger-custom">
              {Object.keys(errors).map(key => <div key={key}>{errors[key]}</div>)}
            </motion.div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3 position-relative">
              <label className="form-label-custom">Email Address</label>
              <div className="input-group-modern">
                <Mail className="input-icon-modern" size={18} />
                <input ref={emailRef} type="email" className="input-modern" placeholder="name@company.com" required />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label-custom">Password</label>
              <div className="input-group-modern">
                <Lock className="input-icon-modern" size={18} />
                <input ref={passwordRef} type="password" className="input-modern" placeholder="••••••••" required />
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check d-flex align-items-center gap-2">
                <input type="checkbox" className="form-check-input-custom" id="rememberMe" />
                <label className="small text-muted cursor-pointer" htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn-modern-submit" disabled={loading}>
              {loading ? <span className="loader"></span> : (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  Sign In <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;