import User from "../models/user.js";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/product.js";

export const getWishlistData = async (username) => {
    try {   

        const userDetails = []
        
        const data = await Wishlist.find({producer:username});
        for(var i=0;i<data.length;i++){

            let customerid = data[i].consumer;
            const customerData = await User.find({username:customerid})
            // console.log(customerData);
            userDetails.push(customerData[0])

        }

        // console.log(userDetails);
        // console.log(data);
        // return res.json({data:userDetails})
        return {data:userDetails};

    } catch (error) {
        
        return {error:"Internal Server Error"};
        // return res.status(500).json({error:"Internal Server Error"});

    }
}


export const getOwnProducts = async (username)=>{
    // try {
        console.log(username);
        const data = await Product.find({username:username})
        console.log(data);
        return {data:data}
    // } catch (error) {
        // return ({error:"Internal Server error"});
        
    // }
}