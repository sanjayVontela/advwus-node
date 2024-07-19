import mongoose from "mongoose";
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
    tiktok:String,
    profilePic:String,
};

const User = mongoose.model("User",userSchema);

export default User;
