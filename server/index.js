const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();               //for dotenv file to manage our private keys.

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

//Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
