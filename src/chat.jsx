import React, { useState, useEffect, useRef} from "react";
import "./App.css";
import { RiRobot2Fill } from "react-icons/ri";
import ChatHistory from "./chathistory";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(input)

  const messagesEndRef = useRef(null);
  // Scroll to the last message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    
    try {
      const response = await fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await response.json();
      const botMessage = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <>
    <div className="maindiv">
    <div className="maindiv1">
       <ChatHistory/>
    </div>
    <div className="maindiv2">
    <div className="navbar">
    <RiRobot2Fill className="icon" id="navicon" />
    <h1>ChatBOT</h1>
    </div>
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${
              msg.sender === "user" ? "user-message" : "bot-message"
            }`}
            
          >
           {msg.sender === "user" ? (
             <div className="text1">{msg.text}</div>
            ) : (
              <div className="botIcon">
             <RiRobot2Fill className="icon" />
             <div className="text">{msg.text}</div>
             </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          className="chat-input"
          placeholder=" Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
    </div>
    </div> 
    </>
  );
};

export default Chat;
