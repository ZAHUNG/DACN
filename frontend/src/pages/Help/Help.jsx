import React, { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";

import {
  ChatWrapper,
  ChatToggleBtn,
  ChatContainer,
  ChatHeader,
  CloseBtn,
  Messages,
  Message,
  InputArea,
  Input,
  SendBtn,
  Status,
} from "./Help.styled";

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
        const filtered = prev.filter((m) => !m.isPending);
        return [...filtered, { sender: "bot", text: data.message }];
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
      socket.emit("askQuestion", { question: input });

      setMessages((prev) => [
        ...prev,
        { sender: "user", text: input },
        { sender: "bot", text: "Đang xử lý...", isPending: true },
      ]);

      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <ChatWrapper>
      {!isChatOpen && (
        <ChatToggleBtn onClick={() => setIsChatOpen(true)}>
          💬 Chat
        </ChatToggleBtn>
      )}

      {isChatOpen && (
        <ChatContainer>
          <ChatHeader>
            <h2>Trợ lí AI tư vấn</h2>
            <CloseBtn onClick={() => setIsChatOpen(false)}>×</CloseBtn>
          </ChatHeader>

          <Messages>
            {messages.map((msg, i) => (
              <Message key={i} className={msg.sender}>
                <strong>{msg.sender === "user" ? "Bạn: " : "AI: "}</strong>
                <span>{msg.isPending ? "Đang xử lý..." : msg.text}</span>
              </Message>
            ))}
            <div ref={messagesEndRef} />
          </Messages>

          <InputArea>
            <Input
              type="text"
              placeholder="Nhập câu hỏi..."
              value={input}
              disabled={!isConnected}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <SendBtn onClick={sendMessage} disabled={!isConnected}>
              Gửi
            </SendBtn>
          </InputArea>

          <Status>Trạng thái: {isConnected ? "Đã kết nối" : "Đang kết nối..."}</Status>
        </ChatContainer>
      )}
    </ChatWrapper>
  );
};

export default Help;
