import User from "../models/user.js";

export const allCustomers = async (req, res) =>{

    await User.find({role:"consumer"})
    .then(data=>{
        return res.json({data:data})
    })
    .catch(err=>{
        return res.send({error:err})
    })
}
