import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from './config/passport-config.js';
import authRoutes from './routes/authRoutes.js';
import imageRoute from './middleware/imageRouter.js';
import userRoute from './routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from localhost:3000
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(session({
    secret: "sanjay",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/images', express.static(path.join(__dirname, 'images')));
mongoose.connect("mongodb+srv://sanjaykumar9949088606:oHazfu5DcCRcVh5b@cluster0.te7hirj.mongodb.net/advwus", { useNewUrlParser: true });


app.use('/auth', authRoutes);
app.use('/image', imageRoute);
app.use("/user",userRoute)




export default app;
