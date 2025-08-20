const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();               //for dotenv file to manage our private keys.
const http= require('http');
const {Server} = require("socket.io");

const app = express();          //Initialising the express server.
app.use(cors());                     //frontend communication
app.use(express.json());               //json to readable

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Successfully connected to MongoDB Atlas!')) 
.catch((error) => console.error('Error connecting to MongoDB Atlas:', error));      //error connecting to database

// First api end point
app.get('/', (req, res) => {
  res.send('Hello, the chat server is running!');
});

app.use('/api/auth', require('./routes/auth.routes'));      //use auth routes from this file 
app.use('/api/users', require('./routes/user.routes.js'));  // use users routes from this file

const server = http.createServer(app);     //Create http server from express app

const io = new Server(server,{
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// server/index.js

const userSocketMap = {}; // Maps userId to an array of socketIds

io.on('connection', (socket) => {
  console.log('A new user connected:', socket.id);

  socket.on('register_user', (userId) => {
      if (!userSocketMap[userId]) {
          userSocketMap[userId] = [];
      }
      userSocketMap[userId].push(socket.id);
  });

  socket.on('send_message', ({ recipientId, text, sender }) => {
      const recipientSocketIds = userSocketMap[recipientId];
        
      if (recipientSocketIds && recipientSocketIds.length > 0) {
          recipientSocketIds.forEach(socketId => {
              io.to(socketId).emit('receive_message', {
                  sender,
                  text,
              });
          });
      }
  });

  socket.on('disconnect', () => {
      // Find which user this socket belonged to and remove it
      for (const userId in userSocketMap) {
          const socketIds = userSocketMap[userId];
          const index = socketIds.indexOf(socket.id);

          if (index !== -1) {
              // Remove just that one socket ID from the list
              socketIds.splice(index, 1);

              // If the user has no more connections, remove them entirely
              if (socketIds.length === 0) {
                  delete userSocketMap[userId];
              }
              break; // Stop searching once we've found and removed it
          }
      }
      console.log('User disconnected:', socket.id);
  });
});

//Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
