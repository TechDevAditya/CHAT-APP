import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChatPage(){
    const [users, setUsers] = useState([]);

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

    return (
        <div>
            <h1>Chat Page</h1>
            <div className="user-list">
                <h2>Users</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user._id}>
                            {user.name}
                        </li>
                    ))}
                </ul>
            </div>
            {/* We will add the message window component here later */}
        </div>
    );
}

export default ChatPage;

