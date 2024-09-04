import ChatMessage from '../models/Chat.js'; 
import User from '../models/user.js';

// Send a new chat message
export const sendMessage = async (req, res) => {
    try {
        const { receiver, message } = req.body;
        const sender = req.user._id;

        if (!receiver || !message) {
            return res.status(400).json({ error: 'Receiver and message are required' });
        }

        const user = await User.findById(receiver);

        if (user) {
            const newMessage = new ChatMessage({
                sender,
                receiver,
                message,
            });

            await newMessage.save();
            return res.status(201).json({ message: 'Message sent successfully', newMessage });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all messages between the current user and another user
export const getConversation = async (req, res) => {
    try {
        const { user } = req.params;

        if (!user) {
            return res.status(400).json({ error: 'User parameter is required' });
        }

        const messages = await ChatMessage.find({
            $or: [
                { sender: req.user._id, receiver: user },
                { sender: user, receiver: req.user._id }
            ]
        }).sort({ createdAt: 1 });
        
        
        return res.status(200).json({ messages });
    } catch (error) {
        
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all conversations for the current user
export const getAllConversations = async (req, res) => {
    try {
        const messages = await ChatMessage.find({
            $or: [{ sender: req.user._id }, { receiver: req.user._id }]
        }).sort({ createdAt: 1 });

        const userIds = [...new Set(messages.flatMap(msg => [msg.sender.toString(), msg.receiver.toString()]))];

        const users = await User.find({ _id: { $in: userIds } }, 'fname lname username profilePic');

        const userMap = {};
        users.forEach(user => {
            if (user._id.toString() !== req.user._id.toString()) {
                userMap[user._id] = user;
            }
        });

        const lastMessages = {};
        messages.forEach(msg => {
            const otherUserId = msg.sender.toString() === req.user._id.toString() ? msg.receiver.toString() : msg.sender.toString();
            if (!lastMessages[otherUserId] || lastMessages[otherUserId].createdAt < msg.createdAt) {
                lastMessages[otherUserId] = msg;
            }
        });

        const result = Object.keys(userMap).map(userId => {
            const { password, email, ...userWithoutSensitiveData } = userMap[userId].toObject();
        
            // Extracting fields from lastMessage to remove specific keys
            const { _id, updatedAt, __v, ...lastMessageWithoutMeta } = lastMessages[userId]?.toObject() || {};
        
            return {
                ...userWithoutSensitiveData,
                lastMessage: lastMessageWithoutMeta || null
            };
        });
        

        return res.json({ data: result });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const markAsRead = async (req, res) => {
    const { messageId } = req.body;
    
    

    try {
        await ChatMessage.findByIdAndUpdate(messageId, { readBy: true });
        res.status(200).json({ success: true, message: 'Message marked as read.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to mark message as read.' });
    }
}

// Get all messages sent by the current user
export const getSentMessages = async (req, res) => {
    try {
        const messages = await ChatMessage.find({ sender: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({ messages });
    } catch (error) {
      
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all messages received by the current user
export const getReceivedMessages = async (req, res) => {
    try {
        const messages = await ChatMessage.find({ receiver: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({ messages });
    } catch (error) {
        
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete a message by its ID
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Message ID is required' });
        }

        const message = await ChatMessage.findById(id);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        if (message.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to delete this message' });
        }

        await ChatMessage.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getSenderName = async (req,res) => {
    try{
        const {id} = req.params;
        const name = await User.findById(id)
        return res.json({data:[name]})
    }
    catch{
            return res.json({error:"Internal Server Error"})
    }
}