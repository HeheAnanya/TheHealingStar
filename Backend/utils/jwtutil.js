/* eslint-disable no-undef */
const jwt = require("jsonwebtoken")

async function jwtToken(payload) {

    let token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" })
    return token


}
async function  verifyToken(token) {
    return jwt.verify(token,process.env.JWT_SECRET)
    
}
module.exports = { jwtToken,verifyToken }
