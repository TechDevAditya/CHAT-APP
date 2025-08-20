const express = require('express');
const Message = require('../models/message.model');

const router = express.Router();

router.get('/:senderId/:recipientId', async (req, res) => {
    try {
        const { senderId, recipientId } = req.params;

        // Find all messages between the two users
        const messages = await Message.find({
            $or: [
                { senderId: senderId, recipientId: recipientId },
                { senderId: recipientId, recipientId: senderId }
            ]
        }).sort({ createdAt: 1 }); // Sort by creation time

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching messages.', error: error });
    }
});

module.exports = router;