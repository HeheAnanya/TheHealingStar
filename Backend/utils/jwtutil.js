/* eslint-disable no-undef */
const jwt = require("jsonwebtoken")

function jwtToken(payload) {

    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" })
    return token


}
function  verifyToken(token) {
    return jwt.verify(token,process.env.JWT_SECRET)
    
}
module.exports = { jwtToken,verifyToken }
