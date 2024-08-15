import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                console.log('Incorrect username');
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!bcrypt.compareSync(password, user.password)) {
                console.log('Incorrect password');
                return done(null, false, { message: 'Incorrect password.' });
            }
            // console.log('User authenticated successfully');
            return done(null, user);
        } catch (err) {
            console.error('Error in LocalStrategy:', err.message);
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    // console.log('Serializing user:', user);
    done(null, user._id); // Serialize user ID
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        // console.log('Deserializing user:', user);
        done(null, user);
    } catch (err) {
        console.error('Error in deserializeUser:', err.message);
        done(err);
    }
});

export default passport;
