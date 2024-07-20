import User from "../models/user.js";
import Product from "../models/product.js";

export const allCustomers = async (req, res) =>{

    await User.find({role:"consumer"})
    .then(data=>{
        return res.json({data:data})
    })
    .catch(err=>{
        return res.send({error:err})
    })
}

export const addProduct = async (req,res) => {
try{
    const jsonData = req.body;
    // console.log(req.user);
    const product = new Product({...jsonData,username:req.user.username});
    product.save();
    return res.send({message:"Success"})
}
catch (error){
    return res.status(500).send({error:"Internal server error"})
}
    
}

export const ownProducts = async (req,res) => {
    
    try {
        // console.log(req.user);
        const data = await Product.find({username:req.user.username})
        return res.json({data:data})
    } catch (error) {
        return res.status(500).json({error:"Internal Server error"});
        
    }
}

export const deleteProduct = async (req,res) => {

    try {
        const data = await Product.findByIdAndDelete(req.params.id);
        return res.json({message:"success"});

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
        // console.log(jsonData);
        // console.log(req.user);
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