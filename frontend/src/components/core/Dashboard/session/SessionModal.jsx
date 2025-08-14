import React, { useEffect, useState } from "react";
import "./Sessions.css";

export default function Sessions() {
    const [sessions, setSessions] = useState([]);
    const [formData, setFormData] = useState({
        course: "",
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        meetingId: "",
        meetingPassword: "",
        meetingUrl: ""
    });
    const [showModal, setShowModal] = useState(false);

    // Fetch all sessions
    useEffect(() => {
        fetch("http://localhost:4000/api/sessions")
            .then(res => res.json())
            .then(data => setSessions(data));
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
    };


    // Handle form submission
    const handleSubmit = async e => {
        e.preventDefault();
        const res = await fetch("http://localhost:4000/api/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        setSessions([...sessions, data]);
        setShowModal(false);
        setFormData({
            course: "",
            title: "",
            description: "",
            startTime: "",
            endTime: "",
            meetingId: "",
            meetingPassword: "",
            meetingUrl: ""
        });
    };

    return (
        <div className="sessions-container">
            <h2>Sessions</h2>
            <button className="btn" onClick={() => setShowModal(true)}>➕ Add Session</button>

            {/* Session List */}
            <ul className="session-list">
                {sessions.map(s => (
                    <li key={s._id} className="session-card">
                        <h3>{s.title}</h3>
                        <p>{s.description}</p>
                        <p>🕒 {new Date(s.startTime).toLocaleString()} → {new Date(s.endTime).toLocaleString()}</p>
                        {s.meetingUrl && (
                            <a href={s.meetingUrl} target="_blank" rel="noreferrer" className="join-link">
                                🔗 Join Meeting
                            </a>
                        )}
                    </li>
                ))}
            </ul>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button className="close-btn" onClick={() => setShowModal(false)}>✖</button>
                        <h3>Create New Session</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                placeholder="Course ID"
                                value={formData.course}
                                onChange={e => setFormData({ ...formData, course: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                            <input
                                type="date"
                                value={formData.startTime}
                                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                value={formData.endTime}
                                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Meeting URL (Zoom/Jitsi/Teams/Meet)"
                                value={formData.meetingUrl}
                                onChange={e => setFormData({ ...formData, meetingUrl: e.target.value })}
                            />
                            <input
                                placeholder="Meeting ID"
                                value={formData.meetingId}
                                onChange={e => setFormData({ ...formData, meetingId: e.target.value })}
                            />
                            <input
                                placeholder="Meeting Password"
                                value={formData.meetingPassword}
                                onChange={e => setFormData({ ...formData, meetingPassword: e.target.value })}
                            />
                            <button type="submit" className="btn-submit">Save Session</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
