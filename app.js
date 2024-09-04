import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from './config/passport-config.js'; // Ensure this is correctly configured
import authRoutes from './routes/authRoutes.js';
import imageRoute from './middleware/imageRouter.js';
import userRoute from './routes/userRoutes.js';
import chatSocketHandler from './controllers/socketHandler.js'; // Import your chatSocketHandler
import chatRoutes from './routes/chatRoutes.js'
import cRoutes from "./routes/cRoutes.js";
import messageRoutes from './routes/messageRoutes.js'
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    pingTimeout:60000,
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
});

// Session middleware
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'sanjay', // Use environment variable for secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
});

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(sessionMiddleware); // Use session middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/images', express.static('images'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://sanjaykumar9949088606:oHazfu5DcCRcVh5b@cluster0.te7hirj.mongodb.net/advwus", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})

// Define routes
app.use('/auth', authRoutes);
app.use('/image', imageRoute);
app.use('/user', userRoute);
app.use('/chat', chatRoutes);
app.use('/c', cRoutes);
app.use('/message', messageRoutes);

// Socket.io setup
// io.use((socket, next) => {
//     sessionMiddleware(socket.request, {}, next); // Apply session middleware
// });

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next); // Apply session middleware
});

io.on('connection', chatSocketHandler);
    


server.listen(4444, () => {
    console.log('Server is running on port 4444');
});
