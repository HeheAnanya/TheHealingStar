/* eslint-disable no-undef */
const AuthService = require("../services/authService")
const { verifyToken, jwtToken } = require("../utils/jwtutil")

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
        let newPass = await AuthService.forgotPassword(email,newPassword)
        return res.status(200).json(newPass)
    }
     catch (err) {
        console.log(err)
        return res.status(401).json({ "Error": err.message })
    }
}

async function refreshTokenHandler(req, res) {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(401).json({ message: "Missing token" })
    try {
        const decoded = verifyToken(refreshToken)
        const newAccess = jwtToken({ userId: decoded.userId }, "1h")
        return res.status(200).json({ accessToken: newAccess })
    } catch (err) {
        console.log(err)
        return res.status(401).json({ "Error": err.message })
    }
}

module.exports = { signup, login,forgotPassword, refreshTokenHandler}