/* eslint-disable no-undef */
const { verifyToken } = require("../utils/jwtutil")

function authMiddleware(req, res, next) {
    const authHead = req.headers.authorization
    const bearerToken = authHead?.startsWith("Bearer ")
        ? authHead.slice(7)
        : null
    const token = bearerToken || req.cookies?.token

    if (!token) {
        return res.status(401).json({ message: "Token missing" })
    }

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
