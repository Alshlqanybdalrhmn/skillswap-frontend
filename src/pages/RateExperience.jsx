import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Star, Loader2 } from 'lucide-react';
import axiosClient from '../axios-client';
import './RateExperience.css';

const RateExperience = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  
  
  const userName = location.state?.userName || "User";
  
  const [rating, setRating] = useState(0); 
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/reviews', {
        reviewed_id: id,
        rating: rating,
        comment: comment
      });
      
      alert("Thank you! Your review has been submitted.");
      navigate(`/users/${id}`); 
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rate-container py-5">
      <div className="container text-center">
        <h2 className="fw-bold mb-1">Rate Your Experience</h2>
        <p className="text-muted mb-4">Share your feedback about {userName}</p>

        <div className="rate-card text-center shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
          {/* Avatar */}
          <div className="avatar-blue mb-3 mx-auto">
            {userName.charAt(0).toUpperCase()}
          </div>
          <h5 className="fw-bold mb-0">{userName}</h5>
          <p className="text-muted small mb-4">Skill Exchange Partner</p>

          <p className="fw-bold small mb-2">How would you rate your skill exchange experience?</p>
          
          {/* Star Rating Section */}
          <div className="d-flex justify-content-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={40}
                style={{ cursor: 'pointer', transition: '0.2s' }}
                className={`star-rating ${rating >= star ? 'active text-warning' : 'text-secondary'}`}
                onClick={() => setRating(star)}
                fill={rating >= star ? "#ffc107" : "none"}
                stroke={rating >= star ? "#ffc107" : "currentColor"}
              />
            ))}
          </div>

          {/* Feedback Form */}
          <div className="text-start mb-4">
            <label className="fw-bold small mb-2">Your Feedback (Optional)</label>
            <textarea 
              className="form-control feedback-area" 
              rows="5" 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Share your experience with ${userName}. What did you learn?`}
            ></textarea>
          </div>

          {/* Buttons Row */}
          <div className="row g-3">
            <div className="col-6">
              <button 
                onClick={() => navigate(-1)} 
                className="btn btn-outline-secondary w-100 rounded-pill"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
            <div className="col-6">
              <button 
                onClick={handleSubmit} 
                className="btn btn-primary w-100 rounded-pill d-flex align-items-center justify-content-center"
                style={{ 
                   backgroundColor: rating > 0 ? '#2563eb' : '#93c5fd',
                   border: 'none'
                }}
                disabled={loading || rating === 0}
              >
                {loading ? <Loader2 className="animate-spin me-2" size={18} /> : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
        
        <p className="small text-muted mt-4">
          Your feedback helps build a trustworthy learning community
        </p>
      </div>
    </div>
  );
};

export default RateExperience;