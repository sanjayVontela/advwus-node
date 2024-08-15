import mongoose from 'mongoose';
import ChatMessage from '../models/Chat.js';
import User from '../models/user.js';

export const chatSocketHandler = (socket) => {
    console.log('Socket connected:', socket.id);

    const session = socket.request.session;
    console.log('Session:', session);

    if (!session || !session.passport || !session.passport.user) {
        console.log('User not authenticated');
        socket.disconnect();
        return;
    }

    const userId = session.passport.user; // Ensure userId is in ObjectId format or convert if necessary
    console.log(`User ${userId} connected`);

    socket.on('chatMessage', async (data) => {
        console.log('Message received:', data);

        // Broadcast the message to all connected clients, except the sender
        socket.broadcast.emit('chatMessage', {
            sender: userId,
            message: data.message,
            receiver: data.receiver
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
            console.log('Message saved successfully');
        } catch (error) {
            console.error('Error saving message:', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User ${userId} disconnected`);
    });
};

export default chatSocketHandler;
