import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from '../components/UserList';
import MessageWindow from '../components/MessageWindow'; 
import MessageInput from '../components/MessageInput';  
import {socket} from '../socket';  //import the shared socket instant

function ChatPage(){
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Connect to the server
        socket.connect();

        function onReceiveMessage(data) {
            setMessages(prevMessages => [...prevMessages, data]);
        }

        // Listen for incoming messages
        socket.on('receive_message', onReceiveMessage);

        // Fetch the initial user list
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };
        fetchUsers();

        // Cleanup function: This runs when the component unmounts
        return () => {
            socket.off('receive_message', onReceiveMessage);
            socket.disconnect();
        };
    }, []); // Runs only once when the component mounts

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        console.log("Selected user:", user);
    }

    const handleSendMessage = (message) => {
        if (selectedUser) {
            const newMessage = {
                sender: 'You', // This should be dynamic later
                text: message
            };

            // Add our own message to the window immediately
            setMessages(prevMessages => [...prevMessages, newMessage]);

            // Emit the message to the server
            socket.emit('send_message', newMessage);
        }
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

