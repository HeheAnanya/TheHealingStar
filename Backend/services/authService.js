/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const prisma = require("../prisma/client")
const bcrypt = require("bcrypt")
const { jwtToken } = require("../utils/jwtutil")

async function signup(detail) {
    let { name, password, email, phoneNumber } = detail
    if (!name || !password || !email || !phoneNumber) {
        throw new Error("Invalid or Missing Credentials")
    }
    try {
        let hashed = await bcrypt.hash(password, 10)
        let user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (user) {
            throw new Error("User already exists, please Login")
        }
        let create = await prisma.user.create({
            data: {
                name: name,
                password: hashed,
                email: email,
                phoneNumber: phoneNumber,
                role: "CUSTOMER"
            }
        })
        return {
            message: "Account created successfully"
        }

    }
    catch (err) {
        throw new Error(err.message)
    }
}

async function login(detail) {
    let { email, password } = detail
    if (!password || !email) {
        throw new Error("Invalid or Missing Credentials")
    }
    try {
        let user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            throw new Error("User doesn't exists, please create an account first")
        }
        let isCorrectPass = await bcrypt.compare(password, user.password)
        if (!isCorrectPass) {
            throw new Error("Wrong Password")
        }
        let token = jwtToken({
            userId: user.id,
            email:user.email,
            role: user.role
        })

        return {
            message: "Login successful",
            token
        }
    }
    catch (err) {
        throw new Error(err.message)
    }

}

async function forgotPassword(email,newPassword) {
    try{
        let user = await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        if (!user){
            throw new Error ("User Not Found! Create an account first.")
        }
        let newHash = await bcrypt.hash(newPassword,10)
        let account = await prisma.user.update({
            where:{
                email:email
            },
            data:{
                password:newHash
            }
        })
        return {message:"Password Updated Successfully"}
    }
     catch (err) {
        throw new Error(err.message)
    }
    
}
module.exports = { signup, login,forgotPassword }