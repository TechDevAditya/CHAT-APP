const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const User = require('../models/user.model');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.', error: error });
    }
});


router.post('/login', async (req,res) => {
    try {
        const{email,password} = req.body;
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(400).json({message: 'Invalid credentials.'});
        }

        const isPasswordCorrect= await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: 'Invalid credentials.'});
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        )

        res.status(200).json({
            token: token,
            userId: user._id,
            name: user.name,
            email: user.email
        });
    }

    catch(error){
        res.status(500).json({ message: 'Server error during login.', error: error });
    }
});

module.exports = router;