import styled, { keyframes } from "styled-components";

export const ChatWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

export const ChatToggleBtn = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const ChatContainer = styled.div`
  width: 350px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: ${slideUp} 0.3s ease-in-out;
`;

export const ChatHeader = styled.div`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CloseBtn = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #ffcccc;
  }
`;

export const Messages = styled.div`
  height: 300px;
  overflow-y: auto;
  padding: 15px;
  background-color: #f5f7fa;
`;

export const Message = styled.div`
  margin: 10px 0;
  padding: 8px 12px;
  border-radius: 10px;
  max-width: 80%;
  word-wrap: break-word;
  font-size: 16px;

  &.user {
    background-color: #007bff;
    color: white;
    margin-left: auto;
    text-align: right;
  }

  &.bot {
    background-color: #e9ecef;
    color: #333;
    margin-right: auto;
  }
`;

export const InputArea = styled.div`
  display: flex;
  padding: 15px;
  background-color: #fff;
  border-top: 1px solid #ddd;
`;

export const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
  font-size: 13.5px;

  &:disabled {
    background-color: #f0f0f0;
  }
`;

export const SendBtn = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  margin-left: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const Status = styled.p`
  text-align: center;
  padding: 5px;
  font-size: 14px;
  color: #666;
  background-color: #fff;
`;

