import React, { useEffect, useState } from "react";
import "./App.css"; 

const ChatHistory = () => {
    const [chatHistory, setChatHistory] = useState([]);
    useEffect(() => {
        fetchChatHistory();
    }, []);

    const fetchChatHistory = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/history");
            const data = await response.json();
            setChatHistory(data);
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    return (
        <div className="container">
            <h3>Chat History</h3>
            <div className="chat-box1">
                {chatHistory.length === 0 ? (
                    <p>No chat history available.</p>
                ) : (
                    chatHistory.map((chat, index) => (
                        <div key={index} className="message">
                            <p className="user-history"> <strong>User:</strong> {chat.user_message}</p>
                            <p className="bot-history"><strong>Bot:</strong> {chat.bot_response}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatHistory;
