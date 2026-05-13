import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../axios-client';
import { Send, ChevronLeft } from 'lucide-react';

export default function Messages() {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUser, setOtherUser] = useState(null);
    const scrollRef = useRef();

    const fetchChat = async () => {
        if (!userId) return;
        try {
            const { data } = await axiosClient.get(`/messages/${userId}`);
            setMessages(data.messages);
            setOtherUser(data.other_user);
            window.dispatchEvent(new Event('refreshAppData'));
        } catch (err) {
            console.error("Chat error:", err);
        }
    };

    useEffect(() => {
        fetchChat();
        const interval = setInterval(fetchChat, 5000);
        return () => clearInterval(interval);
    }, [userId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const { data } = await axiosClient.post('/messages', {
                receiver_id: userId,
                message: newMessage
            });
            setMessages([...messages, data]);
            setNewMessage('');
            
            window.dispatchEvent(new Event('refreshAppData'));
        } catch (err) {
            alert("Failed to send message");
        }
    };

    if (!userId) return <div className="text-center py-5">Select a contact to start chatting!</div>;

    return (
        <div className="container py-4">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden" style={{ height: '80vh' }}>
                <div className="card-header bg-white border-bottom p-3 d-flex align-items-center gap-3">
                    <button className="btn btn-link text-dark p-0 d-md-none" onClick={() => window.history.back()}>
                        <ChevronLeft />
                    </button>
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                        {otherUser?.name?.charAt(0) || 'U'}
                    </div>
                    <h6 className="fw-bold m-0">{otherUser?.name || 'Loading...'}</h6>
                </div>

                <div className="card-body overflow-auto p-4 bg-light" style={{ flex: 1 }}>
                    {messages.map((msg, idx) => {
                        const isMe = msg.sender_id != userId;
                        return (
                            <div key={idx} className={`d-flex mb-3 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div className={`p-3 rounded-4 shadow-sm`} style={{ 
                                    maxWidth: '75%', 
                                    backgroundColor: isMe ? '#2563eb' : '#fff',
                                    color: isMe ? '#fff' : '#000',
                                    borderRadius: isMe ? '20px 20px 0 20px' : '20px 20px 20px 0'
                                }}>
                                    <p className="m-0 small">{msg.message}</p>
                                    <small className={`d-block mt-1 opacity-75`} style={{ fontSize: '10px' }}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </small>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>

                <form onSubmit={handleSend} className="card-footer bg-white border-top p-3">
                    <div className="input-group">
                        <input 
                            type="text" 
                            className="form-control border-0 bg-light rounded-pill px-4" 
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button className="btn btn-primary rounded-circle ms-2 d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}>
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}