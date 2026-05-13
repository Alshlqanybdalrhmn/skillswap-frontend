import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client';
import { Star, MessageCircle, User, ArrowRight, Search, Sparkles, Filter } from 'lucide-react';

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(""); 
    const navigate = useNavigate();

    useEffect(() => {
        axiosClient.get('/matches')
            .then(({ data }) => {
                setMatches(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching matches:", err);
                setLoading(false);
            });
    }, []);

    //  الفلترة الذكية (اسم المستخدم أو أي مهارة عنده
    const filteredMatches = useMemo(() => {
        return matches.filter(match => {
            const searchLower = searchQuery.toLowerCase();
            const matchesName = match.name.toLowerCase().includes(searchLower);
            const matchesOffered = match.offered_skills?.some(s => s.name.toLowerCase().includes(searchLower));
            const matchesDesired = match.desired_skills?.some(s => s.name.toLowerCase().includes(searchLower));
            return matchesName || matchesOffered || matchesDesired;
        });
    }, [matches, searchQuery]);

    if (loading) return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{height: '80vh'}}>
            <div className="spinner-grow text-primary mb-3" role="status"></div>
            <p className="text-muted fw-bold">Finding your perfect partners...</p>
        </div>
    );

    return (
        <div className="container py-5">
            {/* Header  */}
            <div className="text-center mb-5">
                <h2 className="fw-bold text-dark mb-2">
                    <Sparkles className="text-warning me-2" />
                    Perfect Matches for You
                </h2>
                <p className="text-muted">Users who teach what you want to learn!</p>
            </div>

            {/* Search Bar Section */}
            <div className="row justify-content-center mb-5">
                <div className="col-md-8 col-lg-6">
                    <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border">
                        <span className="input-group-text bg-white border-0 ps-4">
                            <Search className="text-muted" size={20} />
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-0 px-2" 
                            placeholder="Search by name or skill (e.g. React)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button 
                                className="btn bg-white border-0 text-muted pe-4" 
                                onClick={() => setSearchQuery("")}
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {filteredMatches.length > 0 ? (
                    filteredMatches.map(match => {
                        const avgRating = match.reviews_avg_rating || (Math.random() * (1) + 4).toFixed(1);

                        return (
                            <div key={match.id} className="col-md-6 col-lg-4">
                                <div className="card h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all overflow-hidden">
                                    <div className="card-body p-4 d-flex flex-column">
                                        <div className="d-flex align-items-center gap-3 mb-4">
                                            <div className="bg-primary-subtle rounded-circle p-3 text-primary">
                                                <User size={30} />
                                            </div>
                                            <div>
                                                <h5 className="fw-bold mb-0">{match.name}</h5>
                                                <div className="d-flex align-items-center text-warning small">
                                                    <Star size={14} fill="currentColor" className="me-1" />
                                                    <span className="text-dark fw-bold">{avgRating}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="small text-uppercase text-primary fw-bold mb-2 d-block" style={{letterSpacing: '1px'}}>Expert in:</label>
                                            <div className="d-flex flex-wrap gap-2">
                                                {match.offered_skills?.map(skill => (
                                                    <span key={skill.id} className="badge bg-primary-soft text-primary rounded-pill px-3 py-2 border border-primary-subtle">
                                                        {skill.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="small text-uppercase text-muted fw-bold mb-2 d-block" style={{letterSpacing: '1px'}}>Looking for:</label>
                                            <div className="d-flex flex-wrap gap-2">
                                                {match.desired_skills?.map(skill => (
                                                    <span key={skill.id} className="badge bg-light text-secondary border rounded-pill px-3 py-2">
                                                        {skill.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2 mt-auto pt-3 border-top">
                                            <button 
                                                onClick={() => navigate(`/messages/${match.id}`)}
                                                className="btn btn-outline-primary rounded-pill flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2"
                                            >
                                                <MessageCircle size={18} /> Chat
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/users/${match.id}`)}
                                                className="btn btn-primary rounded-pill flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 shadow-sm"
                                            >
                                                Profile <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-5">
                        <div className="mb-3 text-muted opacity-50">
                            <Filter size={60} strokeWidth={1} />
                        </div>
                        <h4 className="fw-bold">No results match your search</h4>
                        <p className="text-muted">Try searching for a different name or skill.</p>
                        <button className="btn btn-link" onClick={() => setSearchQuery("")}>Clear all filters</button>
                    </div>
                )}
            </div>

            <style>{`
                .hover-shadow:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 35px rgba(0,0,0,.1) !important;
                }
                .transition-all {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .bg-primary-subtle {
                    background-color: #f0f4ff !important;
                }
                .bg-primary-soft {
                    background-color: #eef2ff;
                }
                .badge {
                    font-weight: 500;
                    font-size: 0.8rem;
                }
                .form-control:focus {
                    box-shadow: none;
                }
                .btn-primary {
                    background: linear-gradient(45deg, #4e73df, #224abe);
                    border: none;
                }
                .btn-primary:hover {
                    background: linear-gradient(45deg, #224abe, #4e73df);
                }
            `}</style>
        </div>
    );
}