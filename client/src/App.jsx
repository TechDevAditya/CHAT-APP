import React from 'react';
import RegisterPage from './pages/RegisterPage'; 
import './App.css'; 
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Routes, Route, Link, Navigate} from 'react-router-dom';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/register">Register</Link> | <Link to="/login">Login</Link> | <Link to="/chat">Chat</Link> {/* add link to chat here **/}
        </nav>

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