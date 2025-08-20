const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();               //for dotenv file to manage our private keys.
const http= require('http');
const {Server} = require("socket.io");
const User = require('./models/user.model');
const Message = require('./models/message.model');

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
app.use('/api/messages', require('./routes/message.routes.js'));   //from this api use message.routes.js

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
  let currentUserId;  //variable to hold user id for this socket connection

  socket.on('register_user', async (userId) => {
      currentUserId = userId;
      if (!userSocketMap[userId]) {
          userSocketMap[userId] = [];
      }
      userSocketMap[userId].push(socket.id);

      await User.findByIdAndUpdate(userId, {isOnline: true});
      socket.broadcast.emit('user_online', {userId});
  });

  //event listener
  // socket.on('send_message', async ({ recipientId, text, sender }) => {
  //     const recipientSocketIds = userSocketMap[recipientId];
        
  //     if (recipientSocketIds && recipientSocketIds.length > 0) {
  //         recipientSocketIds.forEach(socketId => {
  //           // don't send back to the sender's own socket
  //           if (socketId !== socket.id) {
  //             io.to(socketId).emit('receive_message', {
  //               sender,
  //               text,
  //             });
  //           }
  //         });
  //     }
  // });

  socket.on('send_message', async ({ recipientId, text, sender }) => {
    try {
        // 1. Create a new message instance
        const newMessage = new Message({
            senderId: sender.id,
            recipientId: recipientId,
            text: text
        });

        // 2. Save the message to the database
        await newMessage.save();

        // 3. Send the message to the recipient in real-time
        const recipientSocketIds = userSocketMap[recipientId];
        if (recipientSocketIds && recipientSocketIds.length > 0) {
            recipientSocketIds.forEach(socketId => {
                io.to(socketId).emit('receive_message', {
                    sender,
                    text,
                });
            });
        }
    } catch (error) {
        console.error('Error saving or sending message:', error);
    }
  });

  socket.on('disconnect', async () => {
      if (currentUserId) {
          // Remove the disconnected socket from the user's list
          const socketIds = userSocketMap[currentUserId];
          const index = socketIds.indexOf(socket.id);
          if (index !== -1) {
              socketIds.splice(index, 1);
          }

          // If the user has no more open connections, mark them as offline
          if (socketIds.length === 0) {
              delete userSocketMap[currentUserId];
              await User.findByIdAndUpdate(currentUserId, { isOnline: false, lastSeen: new Date() });
              socket.broadcast.emit('user_offline', { userId: currentUserId, lastSeen: new Date()});
          }
      }
      console.log('User disconnected:', socket.id);
  });

  //typing event
  socket.on('user_typing', ({from, to})  => {
    const recipientSockerIds = userSocketMap[to];
    if(recipientSockerIds) {
      recipientSockerIds.forEach(socketId => {
        if(socketId != socket.id){
          io.to(socketId).emit('user_typing', {from});
        }
      });
    }
  });

  socket.on('stop_typing', ({ from, to }) => {
    const recipientSocketIds = userSocketMap[to];
    if (recipientSocketIds) {
      recipientSocketIds.forEach(socketId => {
        if (socketId !== socket.id) {
          io.to(socketId).emit('stop_typing', { from });
        }
      });
    }
  });

  // socket.on('disconnect', () => {
  //     // Find which user this socket belonged to and remove it
  //     for (const userId in userSocketMap) {
  //         const socketIds = userSocketMap[userId];
  //         const index = socketIds.indexOf(socket.id);

  //         if (index !== -1) {
  //             // Remove just that one socket ID from the list
  //             socketIds.splice(index, 1);

  //             // If the user has no more connections, remove them entirely
  //             if (socketIds.length === 0) {
  //                 delete userSocketMap[userId];
  //             }
  //             break; // Stop searching once we've found and removed it
  //         }
  //     }
  //     console.log('User disconnected:', socket.id);
  // });
});

//Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
