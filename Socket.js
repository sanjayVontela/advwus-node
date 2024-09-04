import { Server as SocketIoServer } from 'socket.io';
import ChatMessage from './models/Chat.js'; // Adjust the path as necessary

export const initializeSocket = (server) => {
    const io = new SocketIoServer(server);

    io.on('connection', (socket) => {
        

        // Handle incoming messages
        socket.on('sendMessage', async (message) => {
            const chatMessage = new ChatMessage({
                sender: message.sender,
                message: message.text,
            });

            try {
                await chatMessage.save();
                io.emit('receiveMessage', message);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        // Handle user disconnect
        socket.on('disconnect', () => {
            
        });
    });

    return io;
};
