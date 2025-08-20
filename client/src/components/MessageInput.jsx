import React, { useState} from 'react';
import { socket } from "../socket";


function MessageInput({ onSendMessage, selectedUser }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage("");
            // stop typing once message is sent
            const senderId = localStorage.getItem("userId");
            if (selectedUser?._id) {
              socket.emit("stop_typing", { from: senderId, to: selectedUser._id });
            }
        }
    };

    const handleChange = (e) => {
        setMessage(e.target.value);
        const senderId = localStorage.getItem("userId");
        const recipientId = selectedUser?._id;
            if (recipientId) {
            socket.emit("user_typing", { from: senderId, to: recipientId });

            // auto stop typing after delay
            clearTimeout(window.typingTimeout);
            window.typingTimeout = setTimeout(() => {
                socket.emit("stop_typing", { from: senderId, to: recipientId });
            }, 1000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="message-input">
            <input
                type="text"
                value={message}
                onChange={handleChange}
                placeholder="Type a message..."
            />
            <button type="submit">Send</button>
        </form>
    );
}

export default MessageInput;
