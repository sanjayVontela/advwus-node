import User from "../models/user.js";
import Product from "../models/product.js";
import Wishlist from "../models/Wishlist.js";
import { getWishlistData, getOwnProducts } from "../service/UserService.js";

export const allCustomers = async (req, res) =>{
    try {
        await User.find({role:"consumer"})
    .then(data=>{
        return res.json({data:data})
    })
    .catch(err=>{
        return res.send({error:err})
    })
    } catch (error) {
        return res.status(500).json({error:"Internal Server Error"});
    }
    
}

export const addProduct = async (req,res) => {
try{
    const jsonData = req.body;
    
    const product = new Product({...jsonData,userId:req.user._id});
    product.save();
    return res.send({message:"Success"})
}
catch (error){
    return res.status(500).send({error:"Internal server error"})
}
    
}

export const ownProducts = async (req,res) => {
    
   try{
    
    
    const data = await getOwnProducts(req.user._id);
    if(data.data){
     
     return res.json(data)
    }
    else{
     return res.status(500).json(data)
    }
   }

   catch(error){
    
    
    res.status(500).json({error:"Internal Server Error"});
   }
    
}

export const deleteProduct = async (req,res) => {

    try {
        await Product.findByIdAndDelete(req.params.id);
        const data = await getOwnProducts(req.user.username);
        return res.json({message:"success",data});

    } catch (error) {
        return res.status(500).json({error:"Internal server error"});
    }

}

export const getProduct = async(req,res)=>{

    try {
        const data = await Product.findById(req.params.id);
        return res.json({data:data});

    } catch (error) {
        return res.status(500).json({error:"Internal Server Error"});
    }


}

export const editProduct = async (req,res) => {
    try{
        const jsonData = req.body;

        await Product.findByIdAndUpdate(jsonData._id,{
            productName:jsonData.productName,
            productType:jsonData.productType,
            productDesc:jsonData.productDesc,
            range:jsonData.range,
            how:jsonData.how
        })
        .then(data=>{
            return res.json({message:"success"})
        })
        .catch(error=>{
            return res.json({error:error})
        })
    }
    catch (error){
        return res.status(500).send({error:"Internal server error"})
    }
        
    }


export const addToWishlist = async (req,res) => {

    
    const id = req.params.id;

    try {
        
        const user = await Wishlist.find({consumer:id,producer:req.user.username});
    
        if(user.length === 0){

            const wish = new Wishlist({
                producer:req.user.username,
                consumer:id
            })
            wish.save()
        
            return res.json({message:"Success"});

        }
        else{
            return res.json({already:"Already in Wishlist"});
            
        }

    } catch (error) {
        
        return res.status(500).json({error:"Internal Server Error"});
    }


}



export const allWishlist = async (req,res) => {

    try {
        
        const userDetails = await getWishlistData(req.user.username);
        if (userDetails.data){
            return res.json({data:userDetails.data})
        }
        else{
            return res.status(500).json(userDetails)
        }

    } catch (error) {
        
        return res.status(500).json({error:"Internal Server Error"})


    }

   
}

export const deleteWishlist = async (req,res) =>{

    try {
        const id = req.params.id;

        const data = await Wishlist.deleteOne({producer:req.user.username,consumer:id})
        
        const remainingData = await getWishlistData(req.user.username)

        if(remainingData.data){

            return res.json({message:"Success",data:remainingData.data})
        }
        else{
            return res.status(500).json(remainingData);
        }
        
    } catch (error) {
        return res.status(500).json({error:"Internal Server Error"});
    }
   

}



export const allProducts = async (req,res) =>{

    try{ 

        if(req.user.role !== "producer"){
            const data = await Product.find({});
            return res.json({data:data})
        }else{
            return res.status(201).json({error:"unauthorized"});
        }

       

    }
    catch{
        return res.status(501).json({error:"Internal Server Error"});
    }

}