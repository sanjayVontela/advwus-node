import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    username: String,
    password: String,
    role: String,
    organizationName: String,
    organizationBio: String,
    channelName: String,
    channelDesc: String,
    where: Array,
    how: String,
    youtube: String,
    insta: String,
    tiktok: String,
    profilePic: String,
});

const User = mongoose.model("User", userSchema, "user");

export default User;
