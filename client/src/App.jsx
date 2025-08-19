import React, {useState ,useEffect } from 'react';
import RegisterPage from './pages/RegisterPage'; 
import './App.css'; 
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Routes, Route, Link, Navigate} from 'react-router-dom';
import {socket} from './socket';
import ChatPage from './pages/ChatPage';

function App() {

  const [message, setMessage] = useState('');   //for our text message

  useEffect(() => {
    function onConnect(){
      console.log('Frontend connected to server');
    }

    function onDisconnect(){
      console.log('Frontend disconnected from server');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.connect();

    //cleanup
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, []);   //effect runs only once

  const sendMessage = (e) => {
    e.preventDefault();
    if(message){
      socket.emit('test_message', message);
      setMessage('');    //clear the input after sending
    }
  }

  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/register">Register</Link> | <Link to="/login">Login</Link> | <Link to="/chat">Chat</Link> {/* add link to chat here **/}
        </nav>

        <hr />
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a test message"
          />
          <button type="submit">Send Text Message Here</button>
        </form>
        <hr />

        <Routes>
          <Route path="/" element={<Navigate to="/register" />} /> {}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;