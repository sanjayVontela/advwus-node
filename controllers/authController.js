import passport from "passport";
import bcrypt from "bcrypt";
import User from "../models/user.js";

export const register = async (req, res)=>{

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
                        tiktok:jsonData.tiktok,
                        profilePic:jsonData.profilePic
                    });
                      new_user.save();
                      return res.status(201).json({ message: "User registered successfully", new_user });
                }

            })
        }

}
catch (error) {
    return res.status(500).json({ error: "Error inserting user into database" });
                
}
}

export const login = async (req,res,next)=>{

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
}

export const changePassword = async (req, res)=>{
    const jsonData = req.body;

    
    try {
        
        const emailCheck = await User.findOne({username:req.user.username})
       
           
            if(emailCheck){
            bcrypt.hash(jsonData.password,10,async (err,hash)=>{

                if(err){
                    return res.status(500).json({ error: "Error hashing password" });
                }
                else{
                      const new_user = User.findOneAndUpdate({username:req.user.username},{password:hash})
                      .then(data=>{
                            return res.status(201).json({ message: "Password Changed Successfully"});
                      })
                      .catch(err=>{
                        return res.status(500).json({ error: "Error Updating Password" });
                      })
                }

            })
        }
    } catch (error) {
        return res.status(500).json({ error: "Error inserting user into database" });
                    
    }
}


export const changeProfile = async (req, res) => {
    try {
        const jsonData = req.body;
        let user = await User.findOne({ username: jsonData.username });

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        Object.keys(jsonData).forEach(key => {
            user[key] = jsonData[key];
        });

        await user.save();

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
};


export const profile = async (req,res) =>{

    try {
        let user = await User.findOne({username:req.user.username});
        return res.json(user);
    } catch (error) {
        res.status(500).send({error:"internal server error"})
    }
}