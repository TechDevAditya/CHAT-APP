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
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [typingUser, setTypingUser] = useState(null);

    useEffect(() => {
        // Connect to the server
        socket.connect();

        //register current user with server
        const currentUserId = localStorage.getItem('userId');
        // if(userId){
        //     socket.emit('register_user', userId);
        // }

        if(currentUserId){
            socket.emit('register_user', currentUserId);
        }

        function onReceiveMessage(data) {
            console.log("A message was received from the server:", data);
            setMessages(prevMessages => [...prevMessages, data]);
        }

        function onUserOnline({userId}) {
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === userId ? {...user, isOnline:true} : user
                )
            );
        }

        function onUserOffline({userId, lastSeen}) {
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === userId ? {...user, isOnline: false, lastSeen} : user
                )
            );
        }

        function onUserTyping({from}) {
            setTypingUser(from);
            setTimeout(() => setTypingUser(null), 2000);  //clear after 2 sec
        }

        //Listeners 
        socket.on('receive_message', onReceiveMessage); // Listen for incoming messages
        socket.on('user_online', onUserOnline);     
        socket.on('user_offline', onUserOffline);   
        socket.on("user_typing", onUserTyping);


        // Fetch the initial user list
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);

                const currentUserId = localStorage.getItem('userId');
                const updatedUsers = response.data.map(user =>
                   user._id === currentUserId ? { ...user, isOnline: true } : user
                );
                setUsers(updatedUsers);


            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };
        fetchUsers();

        // Cleanup function: This runs when the component unmounts
        return () => {
            socket.off('receive_message', onReceiveMessage);
            socket.off('user_online', onUserOnline);       
            socket.off('user_offline', onUserOffline);
            socket.disconnect();
        };
    }, []); // Runs only once when the component mounts

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        console.log("Selected user:", user);
    }

    const handleSendMessage = (messageText) => {
        if (selectedUser) {
            const senderName = localStorage.getItem('name');
            const senderId = localStorage.getItem('userId');

            const newMessage={
                sender: { id: senderId, name: senderName }, // Send sender's full info
                text: messageText
            }

            // Add our own message to the window immediately
            setMessages(prevMessages => [...prevMessages, newMessage]);

            // Emit the message now with the recepient's ID
            socket.emit('send_message', {
                recipientId: selectedUser._id,
                text: messageText,
                sender: { id: senderId, name: senderName }
            });
        }
    };


    return (
        <div style={{ display: 'flex' }}>
            <UserList users={users} onSelectUser={handleSelectUser} />

            <div className="chat-area">
                {selectedUser ? (
                    <>
                        <h2>Chatting with: {selectedUser.name}
                        </h2>
                        <h2>
                            {selectedUser.isOnline ? <span style={{color:"green"}}>(online)</span> : <span style = {{color:"grey"}}>(last seen {new Date(selectedUser.lastSeen).toLocaleString()})</span>}
                        </h2>
                        <MessageWindow messages={messages} currentUserId= {localStorage.getItem('userId')} />
                        <MessageInput onSendMessage={handleSendMessage} />
                        {typingUser === selectedUser._id && <p> {selectedUser.name} is typing... </p>}
                    </>
                ) : (
                    <h2>Please select a user to start chatting.</h2>
                )}
            </div>
        </div>
    );

}

export default ChatPage;


