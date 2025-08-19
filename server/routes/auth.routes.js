const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const User = require('../models/user.model');

router.post('/login', async (req,res) => {
    try {
        const{email,password} = req.body;
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(400).json({message: 'Invalid credentials.'});
        }

        const isPasswordCorrect= await bcrypt.compare(pass,user.password);
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