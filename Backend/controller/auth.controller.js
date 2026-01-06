/* eslint-disable no-undef */
const AuthService = require("../services/authService")

async function signup(req, res) {
    try {
        let data = req.body
        let result = await AuthService.signup(data)
        return res.status(201).json(result)
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ "Error": err })
    }
}
async function login(req, res) {
    try {
        let data = req.body
        let result = await AuthService.login(data)
        return res.status(200).json(result)
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({ "Error": err.message })
    }

}
async function forgotPassword(req,res) {
    try{
        const {email,newPassword} = req.body 
        if (!email || !newPassword){
            return res.status(400).json({ message: "Email and password required" })
        }
        let newPass = await AuthService.forgotPassword({email,newPassword})
        return res.status(200).json(newPass)
    }
     catch (err) {
        console.log(err)
        return res.status(401).json({ "Error": err.message })
    }
}

module.exports = { signup, login,forgotPassword }