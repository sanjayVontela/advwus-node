import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    username:String,
    productName:String,
    productType:String,
    productDesc:String,
    range:Array,
    how:String
})

const Product = mongoose.model("Product",productSchema,"products");

export  default Product;

