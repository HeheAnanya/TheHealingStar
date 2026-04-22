/* eslint-disable no-undef */
const jwt = require("jsonwebtoken")

function jwtToken(payload,expiresIn="1h") {

    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })
    return token


}
function  verifyToken(token) {
    return jwt.verify(token,process.env.JWT_SECRET)
    
}
module.exports = { jwtToken,verifyToken }
