import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../axios-client';
import { Star, MessageSquare, BookOpen, Award, User as UserIcon, Loader2 } from 'lucide-react';

export default function UserProfile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [rating, setRating] = useState(0); 
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, [id]);

    const fetchUserData = () => {
        setLoading(true);
        axiosClient.get(`/users/${id}`)
            .then(({ data }) => {
                setUser(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching user data:", err);
                setLoading(false);
            });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please select a star rating!");
            return;
        }
        setSubmitting(true);
        try {
            await axiosClient.post('/reviews', {
                reviewed_id: id,
                rating: rating,
                comment: comment
            });
            setComment("");
            setRating(0);
            alert("Thank you! Your review has been submitted.");
            fetchUserData(); 
        } catch (err) {
            console.error("Error submitting review:", err);
            alert("Failed to submit review.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
                <div className="text-center">
                    <Loader2 className="animate-spin text-primary mb-2" size={40} />
                    <p className="text-muted fw-bold">Loading Profile...</p>
                </div>
            </div>
        );
    }

    if (!user) return <div className="text-center mt-5 text-danger fw-bold">User not found!</div>;

  
    const reviews = user?.reviews || [];
    const avgRating = reviews.length > 0 
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1) 
        : "0.0";

    return (
        <div className="container py-5">
            {/* Header Section */}
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
                <div className="bg-primary p-5 text-white text-center">
                    <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '100px', height: '100px' }}>
                        <UserIcon size={50} className="text-primary" />
                    </div>
                    <h2 className="fw-bold mb-1">{user?.name}</h2>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <div className="text-warning d-flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={20} fill={i < Math.round(avgRating) ? "currentColor" : "none"} />
                            ))}
                        </div>
                        <span className="fw-bold">{avgRating}</span>
                        <span className="opacity-75">({reviews.length} Reviews)</span>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8">
                    {/* Skills Section */}
                    <div className="card shadow-sm border-0 p-4 mb-4 rounded-4">
                        <h5 className="fw-bold mb-4 d-flex align-items-center">
                            <BookOpen className="me-2 text-primary" /> Skills & Expertise
                        </h5>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <h6 className="text-muted mb-3 small fw-bold text-uppercase">Can Teach:</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {user?.offered_skills?.length > 0 ? user.offered_skills.map(skill => (
                                        <span key={skill.id} className="badge bg-primary-subtle text-primary p-2 px-3 rounded-pill border border-primary-subtle">
                                            {skill.name}
                                        </span>
                                    )) : <span className="text-muted small italic">No skills listed</span>}
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <h6 className="text-muted mb-3 small fw-bold text-uppercase">Wants to Learn:</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {user?.desired_skills?.length > 0 ? user.desired_skills.map(skill => (
                                        <span key={skill.id} className="badge bg-success-subtle text-success p-2 px-3 rounded-pill border border-success-subtle">
                                            {skill.name}
                                        </span>
                                    )) : <span className="text-muted small italic">No interests listed</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Review List */}
                    <div className="card shadow-sm border-0 p-4 rounded-4">
                        <h5 className="fw-bold mb-4 d-flex align-items-center">
                            <Award className="me-2 text-primary" /> What others say
                        </h5>
                        {reviews.length > 0 ? (
                            reviews.map(rev => (
                                <div key={rev.id} className="border-bottom pb-3 mb-3 last-child-border-0">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span className="fw-bold small">{rev.reviewer?.name || "SkillSwap User"}</span>
                                        <div className="text-warning small d-flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-muted mb-0 small">{rev.comment}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted small mb-0">No reviews yet. Be the first to rate!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Form */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 p-4 rounded-4 sticky-top" style={{ top: '90px' }}>
                        <h5 className="fw-bold mb-1">Leave a Review</h5>
                        <p className="text-muted small mb-4">How was your experience?</p>
                        
                        <form onSubmit={handleReviewSubmit}>
                            <div className="mb-4 text-center">
                                <div className="d-flex justify-content-center gap-1 mb-2">
                                    {[...Array(5)].map((_, star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            className="bg-transparent border-0 p-0"
                                            onClick={() => setRating(star + 1)}
                                            onMouseEnter={() => setHover(star + 1)}
                                            onMouseLeave={() => setHover(0)}
                                        >
                                            <Star
                                                size={32}
                                                style={{ transition: '0.2s', cursor: 'pointer' }}
                                                fill={(hover || rating) > star ? "#ffc107" : "none"}
                                                stroke={(hover || rating) > star ? "#ffc107" : "#cbd5e1"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">Comment</label>
                                <textarea 
                                    className="form-control rounded-3 border-light-subtle shadow-sm" 
                                    rows="4" 
                                    placeholder="Tell us what you learned..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            
                            <button 
                                type="submit" 
                                className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm"
                                disabled={submitting}
                            >
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : "Post Review"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}