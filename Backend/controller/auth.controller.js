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
// async function login(req, res) {
//     try {
//         let data = req.body
//         let result = await AuthService.login(data)
//         return res.status(200).json(result)
//     }
//     catch (err) {
//         console.log(err)
//         return res.status(401).json({ "Error": err.message })
//     }

// }

async function login(req, res) {
    try {
        const data = req.body;
        const result = await AuthService.login(data);

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 60 * 60 * 1000,
            path: "/"
        });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        return res.status(200).json({
            message: "Login successful"
        });
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            Error: err.message
        });
    }
}
// async function forgotPassword(req,res) {
//     try{
//         const {email,newPassword} = req.body 
//         if (!email || !newPassword){
//             return res.status(400).json({ message: "Email and password required" })
//         }
//         let newPass = await AuthService.forgotPassword(email,newPassword)
//         return res.status(200).json(newPass)
//     }
//      catch (err) {
//         console.log(err)
//         return res.status(401).json({ "Error": err.message })
//     }
// }
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const frontendUrl =
            process.env.FRONTEND_URL || "http://localhost:5173";

        const result = await AuthService.forgotPassword(
            email,
            frontendUrl
        );

        return res.status(200).json(result);
    } catch (err) {
        console.error("Forgot password",err);
        return res.status(500).json({
            message: "Unable to process password reset request"
        });
    }
}
async function resetPassword(req, res) {
    try {
        const { token, newPassword } = req.body;

        const result = await AuthService.resetPassword(
            token,
            newPassword
        );

        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }
}

// async function refreshTokenHandler(req, res) {
//     const { refreshToken } = req.body
//     if (!refreshToken) return res.status(401).json({ message: "Missing token" })
//     try {
//         const decoded = verifyToken(refreshToken)
//         const newAccess = jwtToken({ userId: decoded.userId }, "1h")
//         return res.status(200).json({ accessToken: newAccess })
//     } catch (err) {
//         console.log(err)
//         return res.status(401).json({ "Error": err.message })
//     }
// }

async function refreshTokenHandler(req, res) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Missing refresh token"
        });
    }

    try {
        const decoded = verifyToken(refreshToken);

        const newAccess = jwtToken(
            { userId: decoded.userId },
            "1h"
        );

        res.cookie("token", newAccess, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 1000,
            path: "/"
        });

        return res.status(200).json({
            message: "Token refreshed"
        });
    } catch (err) {
        return res.status(401).json({
            message: "Invalid refresh token"
        });
    }
}

async function googleCallback(req, res) {
    try {
        const user = req.user;

        if (!user) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
            );
        }

        const token = jwtToken({
            userId: user.id,
            email: user.email,
            role: user.role
        }, "1h");

        const refreshToken = jwtToken({
            userId: user.id
        }, "7d");

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 60 * 60 * 1000,
            path: "/"
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        return res.redirect(
            `${process.env.FRONTEND_URL}/auth/callback`
        );
    } catch (err) {
        console.error("Google callback error:", err);
        return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
        );
    }
}

async function currentUser(req, res) {
    try {
        const prisma = require("../prisma/client");
        const user = await prisma.user.findUnique({ where: { id: Number(req.user.userId) }, select: { id: true, name: true, email: true, role: true, createdAt: true } });
        if (!user) return res.status(404).json({ message: "Account not found" });
        return res.status(200).json({ user });
    } catch (err) { return res.status(500).json({ message: "Could not load account" }); }
}
function logout(req, res) {
    const options = { path: "/", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", secure: process.env.NODE_ENV === "production" };
    res.clearCookie("token", options);
    res.clearCookie("refreshToken", options);
    return res.status(200).json({ message: "Logged out" });
}

module.exports = { signup, login, forgotPassword, refreshTokenHandler, googleCallback, resetPassword, currentUser, logout };