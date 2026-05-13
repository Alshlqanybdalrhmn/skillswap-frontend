import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus,Users, Search, MessageCircle, Star, Grid, ShieldCheck, Zap, ArrowRight,BookOpen, Trophy   } from 'lucide-react';


import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-new">
      {/* Navbar*/}
      <nav className="navbar navbar-expand-lg bg-white py-3 px-4 shadow-sm sticky-top">
        <div className="container">
          <div className="navbar-brand fw-bold d-flex align-items-center" style={{cursor: 'pointer'}}>
             <div className="bg-primary text-white p-1 rounded me-2"><Zap size={20} /></div>
             SkillSwap
          </div>
          <div className="ms-auto d-flex gap-2">
            <button className="btn btn-light btn-sm px-3 fw-bold" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-dark btn-sm px-3 fw-bold" onClick={() => navigate('/register')}>Register</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-new text-center">
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">Exchange Skills Without Money</h1>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: '650px' }}>
            SkillSwap is a web-based platform that connects people who want to learn new skills with those who can teach them. Exchange skills freely in a community-driven environment.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-dark px-4 py-2 d-flex align-items-center gap-2" onClick={() => navigate('/register')}>
              Get Started <ArrowRight size={18} />
            </button>
            <button className="btn btn-outline-secondary px-4 py-2" onClick={() => navigate('/matches')}>Browse Skills</button>
          </div>
        </div>
      </header>

      {/* Section: Why SkillSwap */}
      <section className="py-5 bg-white">
        <div className="container">
          <h3 className="text-center fw-bold mb-5">Why SkillSwap?</h3>
          <div className="why-box p-4 mx-auto shadow-sm border rounded-4" style={{ maxWidth: '800px' }}>
            <p className="text-muted mb-4">
              In today's world, many people want to learn new skills but face financial barriers. Traditional education and courses can be expensive, limiting access to knowledge.
            </p>
            <p className="text-muted mb-0">
              SkillSwap solves this problem by creating a platform where users can exchange skills directly with each other, eliminating the need for money while fostering a collaborative learning community.
            </p>
          </div>
        </div>
      </section>
      {/* Benefits Section - Why SkillSwap */}
<section className="py-5">
  <div className="container">
    <div className="row g-4">
      {/*  Learn New Skills */}
      <div className="col-md-4">
        <div className="benefit-card p-4 shadow-sm border-0 h-100">
          <div className="icon-wrap bg-blue-subtle mb-3">
            <BookOpen size={24} className="text-primary" />
          </div>
          <h5 className="fw-bold mb-3">Learn New Skills</h5>
          <p className="text-muted small">
            Discover people who can teach you what you want to learn, from programming to photography.
          </p>
        </div>
      </div>

      {/*  Share Your Expertise */}
      <div className="col-md-4">
        <div className="benefit-card p-4 shadow-sm border-0 h-100">
          <div className="icon-wrap bg-green-subtle mb-3">
            <Trophy size={24} className="text-success" />
          </div>
          <h5 className="fw-bold mb-3">Share Your Expertise</h5>
          <p className="text-muted small">
            Help others by teaching skills you're passionate about while learning something new in return.
          </p>
        </div>
      </div>

      {/*  Connect & Collaborate */}
      <div className="col-md-4">
        <div className="benefit-card p-4 shadow-sm border-0 h-100">
          <div className="icon-wrap bg-yellow-subtle mb-3">
            <MessageCircle size={24} className="text-warning" />
          </div>
          <h5 className="fw-bold mb-3">Connect & Collaborate</h5>
          <p className="text-muted small">
            Build meaningful connections with fellow learners and create a supportive learning community.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>


     {/* How It Works Section */}
<section className="py-5 bg-white">
  <div className="container text-center">
    <h3 className="fw-bold mb-5 mt-4">How It Works</h3>
    
    <div className="row g-4 justify-content-center">
      <div className="col-md-3">
        <div className="step-item">
          <div className="icon-circle-small bg-blue-subtle text-primary mx-auto mb-3">
            <Users size={20} />
          </div>
          <h6 className="fw-bold mb-2">Create Profile</h6>
          <p className="text-muted extra-small">List skills you offer and want to learn</p>
        </div>
      </div>

      <div className="col-md-3">
        <div className="step-item">
          <div className="icon-circle-small bg-green-subtle text-success mx-auto mb-3">
            <BookOpen size={20} />
          </div>
          <h6 className="fw-bold mb-2">Get Matched</h6>
          <p className="text-muted extra-small">Find peers with complementary skills</p>
        </div>
      </div>
 
      <div className="col-md-3">
        <div className="step-item">
          <div className="icon-circle-small bg-indigo-subtle text-indigo mx-auto mb-3">
            <MessageCircle size={20} />
          </div>
          <h6 className="fw-bold mb-2">Connect & Learn</h6>
          <p className="text-muted extra-small">Chat and schedule skill exchange sessions</p>
        </div>
      </div>

      <div className="col-md-3">
        <div className="step-item">
          <div className="icon-circle-small bg-orange-subtle text-warning mx-auto mb-3">
            <Star size={20} />
          </div>
          <h6 className="fw-bold mb-2">Rate & Review</h6>
          <p className="text-muted extra-small">Build trust through feedback</p>
        </div>
      </div>
    </div>
  </div>
</section>


      {/*  Main Features */}
      <section className="py-5 bg-white">
        <div className="container">
          <h3 className="text-center fw-bold mb-5">Main Features</h3>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="feature-card d-flex gap-3 p-4 border rounded-4 shadow-sm">
                <Zap className="text-primary mt-1" />
                <div>
                  <h6 className="fw-bold mb-1">Smart Matching System</h6>
                  <p className="text-muted small mb-0">Automatically find users who can teach what you want to learn and learn what you can teach</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="feature-card d-flex gap-3 p-4 border rounded-4 shadow-sm">
                <MessageCircle className="text-primary mt-1" />
                <div>
                  <h6 className="fw-bold mb-1">Real-Time Chat</h6>
                  <p className="text-muted small mb-0">Communicate with matched users instantly through our integrated messaging system</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="feature-card d-flex gap-3 p-4 border rounded-4 shadow-sm">
                <Star className="text-primary mt-1" />
                <div>
                  <h6 className="fw-bold mb-1">Ratings & Reviews</h6>
                  <p className="text-muted small mb-0">Build trust through a transparent rating system and user feedback</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="feature-card d-flex gap-3 p-4 border rounded-4 shadow-sm">
                <Grid className="text-primary mt-1" />
                <div>
                  <h6 className="fw-bold mb-1">Skill Categories</h6>
                  <p className="text-muted small mb-0">Browse and filter skills across various categories including tech, languages, arts, and more</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer  */}
      <footer className="footer-cta py-5 text-center text-white">
        <div className="container">
          <h3 className="fw-bold mb-3">Ready to Start Learning?</h3>
          <p className="mb-4 opacity-75 mx-auto" style={{ maxWidth: '600px' }}>Join thousands of users already exchanging skills on SkillSwap. Create your account and start your learning journey today.</p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-light px-4 fw-bold d-flex align-items-center gap-2" onClick={() => navigate('/register')}>
              Create Account <ArrowRight size={18} />
            </button>
            <button className="btn btn-outline-light px-4 fw-bold" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
