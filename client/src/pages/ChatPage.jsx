import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from '../components/UserList';

function ChatPage(){
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

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

    return (
        <div>
            <h1>Chat Page</h1>
            {/* 4. Use the UserList component and pass propertiess to it */}
            <UserList users={users} onSelectUser={handleSelectUser} />

            <div className="message-window">
                {/* who is selected */}
                {selectedUser ? (
                    <h2>Chatting with: {selectedUser.name}</h2>
                ) : (
                    <h2>Please select a user to start chatting.</h2>
                )}
                {/* We will add the message history and input box here */}
            </div>
        </div>
    );
}

export default ChatPage;

