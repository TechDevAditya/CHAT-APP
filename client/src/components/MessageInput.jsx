import React, { useState } from 'react';

function MessageInput({ onSendMessage }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="message-input">
            <input
                type="text"
                value={message}
                onChange={(e) => {
                    setMessage(e.target.value);
                    const senderId = localStorage.getItem("userId");
                    const recipientId = selectedUser?._id;
                    if(recipientId) {
                        socket.emit("typing", { from: senderId, to: recipientId});
                    }
                }}
                placeholder="Type a message..."
            />
            <button type="submit">Send</button>
        </form>
    );
}

export default MessageInput;
