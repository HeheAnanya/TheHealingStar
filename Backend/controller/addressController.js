/* eslint-disable no-undef */
// , addAddress(userId, data), deleteAddress(addressId)
const address = require("../services/addressService")

async function getAddresses(req,res) {
    let {userId} = req.user
    try{
        
        let result = await address.getAddresses(userId)
        return res.status(201).json(result)
    }

        catch(err){
        console.log(err)
        return res.status(500).json({"Error":"Internal Server Error"})
    
    }
    
}
async function addAddress(req,res) {
    let {userId} = req.user
    let data = req.body
    try{
        
        let result = await address.addAddress(userId,data)
        return res.status(201).json(result)
    }

        catch(err){
        console.log(err)
        return res.status(500).json({"Error":"Internal Server Error"})
    
    }
    
}
async function deleteAddress(req,res) {
    let {userId} = req.user
    try{
        
        let result = await address.deleteAddress(userId)
        return res.status(201).json(result)
    }

        catch(err){
        console.log(err)
        return res.status(500).json({"Error":"Internal Server Error"})
    
    }
    
}
module.exports = {getAddresses,deleteAddress,addAddress}