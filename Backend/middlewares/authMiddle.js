/* eslint-disable no-undef */
const { verifyToken } = require("../utils/jwtutil")

function authMiddleware(req, res, next) {
    const authHead = req.headers.authorization
    if (!authHead) {
        return res.status(401).json({ message: "Token missing" })
    }
    let token = authHead.split(" ")[1]
    try {
        const decoded = verifyToken(token)
        req.user = decoded
        next()
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({ message: "Invalid or expired token" })
    }

}
module.exports = { authMiddleware }