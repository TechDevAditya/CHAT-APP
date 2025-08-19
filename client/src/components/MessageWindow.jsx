import React from 'react';

function MessageWindow({ messages }) {
    return (
        <div className="message-window">
            <h2>Messages</h2>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>
                        <strong>{msg.sender}: </strong> {msg.text}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default MessageWindow;