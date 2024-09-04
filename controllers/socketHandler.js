import mongoose from 'mongoose';
import ChatMessage from '../models/Chat.js';
import User from '../models/user.js';

export const chatSocketHandler = (socket) => {
    

    const session = socket.request.session;
   

    if (!session || !session.passport || !session.passport.user) {
        
        socket.disconnect();
        return;
    }

    const userId = session.passport.user; // Ensure userId is in ObjectId format or convert if necessary
    

    socket.on('chatMessage', async (data) => {
        

        // Broadcast the message to all connected clients, except the sender
        socket.broadcast.emit('chatMessage', {
            sender: userId,
            message: data.message,
            receiver: data.receiver,
            name:data.name
        });

        // Save the message to the database
        try {
            const newMessage = new ChatMessage({
                sender: userId, // Ensure sender is an ObjectId
                receiver: data.receiver, // Ensure receiver is an ObjectId
                message: data.message,
                timestamp: new Date()
            });
            await newMessage.save();
            
        } catch (error) {
            
        }
    });

    socket.on('disconnect', () => {
        
    });
};

export default chatSocketHandler;