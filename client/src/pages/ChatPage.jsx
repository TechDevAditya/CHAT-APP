import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from '../components/UserList';
import MessageWindow from '../components/MessageWindow'; 
import MessageInput from '../components/MessageInput';  

function ChatPage(){
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([
        {sender: 'adi', text: 'Hey, how are you?'},
        {sender: 'You', text: 'I am good, thanks'}

    ]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if(!token){
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}` // Send the token for authorization
                    }
                });

                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };

        fetchUsers();
    }, []);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        console.log("Selected user:", user);
    }

    const handleSendMessage = (message) => {
        console.log(`Sending message to ${selectedUser.name}: ${message}`);
        // LATER: We will replace this with socket.emit()
        const newMessage = { sender: 'You', text: message };
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };


    return (
        <div style={{ display: 'flex' }}>
            <UserList users={users} onSelectUser={handleSelectUser} />

            <div className="chat-area">
                {selectedUser ? (
                    <>
                        <h2>Chatting with: {selectedUser.name}</h2>
                        <MessageWindow messages={messages} />
                        <MessageInput onSendMessage={handleSendMessage} />
                    </>
                ) : (
                    <h2>Please select a user to start chatting.</h2>
                )}
            </div>
        </div>
    );

}

export default ChatPage;

