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

io.on('connection', (socket) => {
  console.log('A new user connected:', socket.id);

  socket.on('send_message', (data) => {
    socket.broadcast.emit('receive_message', data);  //send the event receiev_message to other connected sockets except for the one sending it
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

//Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
