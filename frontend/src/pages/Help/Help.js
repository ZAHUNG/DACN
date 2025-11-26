import React, { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import "./Help.css";

const Help = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Chào bạn! Hãy hỏi tôi về sản phẩm bạn quan tâm nhé!" },
      ]);
    }

    function onDisconnect() {
      setIsConnected(false);
      setMessages((prev) => [...prev, { sender: "bot", text: "Mất kết nối!" }]);
    }

    function onChatResponse(data) {
      setMessages((prev) => {
        const filteredMessages = prev.filter(msg => !msg.isPending);
        return [...filteredMessages, { sender: "bot", text: data.message }];
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chatResponse", onChatResponse);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chatResponse", onChatResponse);
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && isConnected) {
      const userMessage = { sender: "user", text: input };
      const pendingMessage = { sender: "bot", text: "", isPending: true }; 

      socket.emit("askQuestion", { question: input }); 
      setMessages((prev) => [...prev, userMessage, pendingMessage]); 
      setInput(""); 
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="chat-wrapper">
      {!isChatOpen && (
        <button className="chat-toggle-btn" onClick={toggleChat}>
          <span role="img" aria-label="chat">
            💬
          </span>{" "}
          Chat
        </button>
      )}

      {isChatOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <h2>Trợ lí AI tư vấn</h2>
            <button className="close-btn" onClick={toggleChat}>
              ×
            </button>
          </div>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <strong>{msg.sender === "user" ? "Bạn: " : "AI: "}</strong>
                <span style={{ whiteSpace: 'pre-line' }}>
                  {msg.isPending ? (
                    <span className="loading-dots">Đang xử lý...</span>
                  ) : (
                    msg.text
                  )}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi về sản phẩm cần tìm..."
              disabled={!isConnected}
            />
            <button onClick={sendMessage} disabled={!isConnected}>
              Gửi
            </button>
          </div>
          <p className="status">
            Trạng thái: {isConnected ? "Đã kết nối" : "Đang kết nối..."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Help;