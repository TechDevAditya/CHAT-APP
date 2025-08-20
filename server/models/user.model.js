const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,             //removes spaces
    },

    email: {
        type: String,   
        required: true,
        unique: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },
    
    isOnline: {
        type: Boolean,
        default: false
    },

    lastSeen: {
        type: Date
    }

}, {
    timestamps: true
});


const User = mongoose.model('User', userSchema);

module.exports = User;