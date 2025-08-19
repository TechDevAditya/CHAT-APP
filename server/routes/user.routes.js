const express = require('express');
const User = require('../models/user.model');

const router = express.Router();

router.get('/', async (req,res) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch(error){
        res.status(500).json({
            message: 'Server error fetching users.', error: error
        });
    }
})

module.exports = router;