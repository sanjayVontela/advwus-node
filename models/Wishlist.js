import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    producer:String,
    consumer:String,
})

const Wishlist = mongoose.model("Wishlist",wishlistSchema,"wishlist");

export  default Wishlist;

