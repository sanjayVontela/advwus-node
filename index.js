import express, { json } from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import passport from "passport";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";


const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from localhost:3000
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
  }));

app.use(session({
    secret:"sanjay",
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*60*24
    }
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://sanjaykumar9949088606:oHazfu5DcCRcVh5b@cluster0.te7hirj.mongodb.net/advwus", {useNewUrlParser: true});
const userSchema = {
    fname:String,
    lname:String,
    username:String,
    password:String,
    role:String,
    organizatonName:String,
    organizationBio:String,
    productName:String,
    productType:String,
    productDesc:String,
    range:Array,
    channelName:String,
    channelDesc:String,
    where:Array,
    how:String,
    youtube:String,
    insta:String,
    tiktok:String
};

const User = mongoose.model("User",userSchema);
app.post("/register",async (req,res)=>{

    const jsonData = req.body;

    try {
        
        const emailCheck = await User.findOne({username:jsonData.username})
        if(emailCheck){
            return res.status(400).json({ error: "Email already exists. Try logging in." });
        }else{
            bcrypt.hash(jsonData.password,10,async (err,hash)=>{

                if(err){
                    return res.status(500).json({ error: "Error hashing password" });
                }
                else{
                      const new_user = new User({
                        fname:jsonData.fname,
                        lname:jsonData.lname,
                        username:jsonData.username,
                        password:hash,
                        role:jsonData.role,
                        organizatonName:jsonData.organizatonName,
                        organizationBio:jsonData.organizationBio,
                        productName:jsonData.productName,
                        productType:jsonData.productType,
                        productDesc:jsonData.productDesc,
                        range:jsonData.range,
                        channelName:jsonData.channelName,
                        channelDesc:jsonData.channelDesc,
                        where:jsonData.where,
                        how:jsonData.how,
                        youtube:jsonData.youtube,
                        insta:jsonData.insta,
                        tiktok:jsonData.tiktok
                    });
                      new_user.save();
                      return res.status(201).json({ message: "User registered successfully", new_user });
                }

            })
        }
    } catch (error) {
        return res.status(500).json({ error: "Error inserting user into database" });
                    
    }
    
    
    // console.log(jsonData.fname);

});

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



app.post('/login', (req, res, next) => {
    // console.log(req.body.username);
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        
        if (!user) {
            return res.status(401).json({ message: "Incorrect credentials" });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json({ message: 'Login successful', user: user });
        });
    })(req, res, next);
});


app.post("/changepassword",async (req,res,next)=>{
    const jsonData = req.body;
    
    try {
        
        const emailCheck = await User.findOne({username:jsonData.username})
       
           
            if(emailCheck){
            bcrypt.hash(jsonData.password,10,async (err,hash)=>{

                if(err){
                    return res.status(500).json({ error: "Error hashing password" });
                }
                else{
                      const new_user = User.findOneAndUpdate({username:jsonData.username},{password:hash})
                      .then(data=>{
                            return res.status(201).json({ message: "Password Changed Successfully", new_user });
                      })
                      .catch(err=>{
                        return res.status(500).json({ error: "Error Updating Password" });
                      })
                }

            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error inserting user into database" });
                    
    }
})


app.listen(4444,()=>{
    console.log(`server running on port ${4444}`);
})