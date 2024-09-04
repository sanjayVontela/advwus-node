import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

passport.use(new LocalStrategy(
    async (username, password, done) => {
        
        try {
            username = username.toLowerCase()
            const user = await User.findOne({ username: username });
            if (!user) {
                
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!bcrypt.compareSync(password, user.password)) {
                
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (err) {
            console.error('Error in LocalStrategy:', err.message);
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    
    done(null, user._id); // Serialize user ID
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        
        done(null, user);
    } catch (err) {
        console.error('Error in deserializeUser:', err.message);
        done(err);
    }
});

export default passport;
