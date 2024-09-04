import User from "../models/user.js";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/product.js";

export const getWishlistData = async (username) => {
    try {   
        
        const data = await Wishlist.find({producer:username});
        const userDetails = [...data.map(item=>item.consumer)]
        const customerDetails = await User.find({username:{$in: userDetails}})
        return {data:customerDetails};

    } catch (error) {
        return {error:"Internal Server Error"};

    }
}


export const getOwnProducts = async (username)=>{
    try {

        const data = await Product.find({userId:username})

        return {data:data}
    } catch (error) {
        return ({error:"Internal Server error"});
        
    }
}