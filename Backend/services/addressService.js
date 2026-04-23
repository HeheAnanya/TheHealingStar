/* eslint-disable no-undef */
const prisma = require("../prisma/client")

async function getAddresses(userId) {
    userId = Number(userId)
    try{
        let found = await prisma.profile.findUnique({
            where:{
                userId:userId
            }
        })
        return found
    }
    catch (err) {
        throw new Error(err.message)
    }

    
}
async function  addAddress(userId, data) {
    userId = Number(userId)
    try{
        let found = await prisma.profile.findUnique({
            where:{
                userId:userId
            }
        })
        if (found){
            let profile = await prisma.profile.upsert({
            where: { userId: userId },
            update: { ...data },
            create: { userId: userId, ...data }
        })
        return profile
        }
        else{
            return "Create an account first"
        }
    }
    catch (err) {
        throw new Error(err.message)
    }
    
}
async function deleteAddress(userId) {
    userId = Number(userId)
    try{
        let found = await prisma.profile.findUnique({
            where:{
                userId:userId
            }
        })
        if (found){
            await prisma.profile.delete({
                where:{
                    userId:userId
                }
            })
            return { message: "Address deleted" }
        }
        else{
            return "Create an account first"
        }
    }
    catch (err) {
        throw new Error(err.message)
    }
    
}
module.exports = {getAddresses,addAddress,deleteAddress}