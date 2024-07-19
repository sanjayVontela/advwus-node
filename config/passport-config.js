import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

passport.use(new LocalStrategy(async (username, password, cb) => {
    // console.log(username,password);
    try {

        await User.findOne({username:username})
        .then(user=>{
            // console.log(user);
            if(!user){
                return cb(null, false, { message: 'Incorrect email.' });
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return cb(null, false, { message: 'Incorrect password.' });
            }
            return cb(null, user);
        })
    } catch (err) {
        return cb(err);
    }
}));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser(async (user, cb) => {
   cb(null,user)
   
});


export default passport;