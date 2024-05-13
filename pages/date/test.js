import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// 連接到 Socket.IO 伺服器
const socket = io('http://localhost:3003');

const Chat = () => {
  // 狀態：訊息列表
  const [messages, setMessages] = useState([]);
  // 狀態：輸入欄位的值
  const [input, setInput] = useState('');

  // 使用 useEffect hook 監聽 'send_message' 事件
  useEffect(() => {
    socket.on('send_message', (message) => {
      // 將新的訊息添加到原有的訊息列表中
      setMessages([...messages, message]);
    });

    // 在組件卸載時，清理事件監聽器
    return () => {
      socket.off('send_message');
    };
  }, [messages]); // messages 狀態發生改變時，useEffect hook 會重新執行

  // 函數：發送訊息
  const sendMessage = () => {
    // 如果輸入的訊息不為空
    if (input.trim() !== '') {
      // 發送 'send_message' 事件到後端
      socket.emit('send_message', input);
      // 清空輸入欄位
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        {/* 顯示訊息列表 */}
        {messages.map((message, index) => (
          <div key={index} className="p-2">
            {message}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()} // 按下 Enter 鍵時發送訊息
          className="border border-gray-400 rounded-md px-3 py-2 w-3/4"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
