import ChatMessage from '../models/Chat.js'; // Adjust path as needed
import User from '../models/user.js';

// Send a new chat message
export const sendMessage = async (req, res) => {
    try {
        const jsonData = req.body;
        // console.log(jsonData);
        
        const sender = req.user._id;
        const receiver = jsonData.receiver;
        const message = jsonData.message;
        
        if (!receiver || !message) {
            return res.status(400).json({ error: 'Receiver and message are required' });
        }
        const user = await User.findById(receiver)
        
        if(user){
            const newMessage = new ChatMessage({...jsonData,sender:sender});

            await newMessage.save();
            return res.status(201).json({ message: 'Message sent successfully', newMessage });
        }
        
        else{
            return res.status(404).json({error:"User not Found"});
        }


        
    } catch (error) {
        console.log(error);
        
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
            $or:[{ sender: req.user._id, receiver: user },{ sender: user, receiver: req.user._id }]
        }
        ).sort({ timestamp: 1 }); // Sort by timestamp to get messages in chronological order
        // console.log(messages);
        
        return res.status(200).json({ messages:messages });
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all messages sent by the current user
export const getSentMessages = async (req, res) => {
    try {
        const messages = await ChatMessage.find({ sender: req.user.username }).sort({ timestamp: -1 });
        return res.status(200).json({ messages });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all messages received by the current user
export const getReceivedMessages = async (req, res) => {
    try {
        const messages = await ChatMessage.find({ receiver: req.user.username }).sort({ timestamp: -1 });
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

        if (message.sender !== req.user.username) {
            return res.status(403).json({ error: 'You are not authorized to delete this message' });
        }

        await ChatMessage.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
