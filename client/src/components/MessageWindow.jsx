import React from 'react';

function MessageWindow({ messages, currentUserId }) {
    return (
        <div className="message-window">
            <h2>Messages</h2>
            <ul>
                {messages.map((msg, index) => {
                    //check if the message sender is the current user
                    const isCurrentUser = msg.sender.id === currentUserId;
                    const senderName = isCurrentUser ? 'You' : msg.sender.name;

                    return(
                        <li key={index}>
                            <strong>{senderName}: </strong> {msg.text}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default MessageWindow;