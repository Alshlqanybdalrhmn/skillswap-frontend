import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client';
import { MessageSquare, Clock, ChevronRight, Search } from 'lucide-react';

export default function MessagesList() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axiosClient.get('/messages')
            .then(({ data }) => {
                setConversations(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching conversations:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="fw-bold m-0 text-dark">Messages</h3>
                        <span className="badge bg-primary-subtle text-primary rounded-pill px-3">
                            {conversations.length} Conversations
                        </span>
                    </div>

                    {/* Search Bar  */}
                    <div className="input-group mb-4 shadow-sm rounded-4 overflow-hidden border-0">
                        <span className="input-group-text bg-white border-0 ps-3">
                            <Search size={18} className="text-muted" />
                        </span>
                        <input type="text" className="form-control border-0 py-3" placeholder="Search for a chat..." />
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="list-group list-group-flush">
                            {conversations.length > 0 ? (
                                conversations.map((chat) => (
                                    <div 
                                        key={chat.id} 
                                        onClick={() => navigate(`/messages/${chat.other_user.id}`)}
                                        className="list-group-item list-group-item-action p-4 border-bottom d-flex align-items-center gap-3 transition-all"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" 
                                             style={{ width: '55px', height: '55px', fontSize: '1.2rem' }}>
                                            {chat.other_user.name.charAt(0)}
                                        </div>
                                        
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <h6 className="fw-bold m-0 text-dark">{chat.other_user.name}</h6>
                                                <small className="text-muted d-flex align-items-center gap-1">
                                                    <Clock size={12} /> Just now
                                                </small>
                                            </div>
                                            <p className="text-muted mb-0 text-truncate small" style={{ maxWidth: '300px' }}>
                                                {chat.last_message}
                                            </p>
                                        </div>

                                        <ChevronRight size={20} className="text-light-emphasis" />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-5">
                                    <MessageSquare size={50} className="text-muted mb-3 opacity-25" />
                                    <h5 className="text-muted">No messages yet</h5>
                                    <p className="small text-muted">Start a conversation from the Matches page!</p>
                                    <button onClick={() => navigate('/matches')} className="btn btn-primary rounded-pill mt-2">
                                        Find Matches
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .transition-all { transition: all 0.2s ease-in-out; }
                .list-group-item-action:hover {
                    background-color: #f8fbff !important;
                    transform: scale(1.01);
                }
            `}</style>
        </div>
    );
}