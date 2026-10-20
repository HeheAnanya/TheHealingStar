/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const prisma = require("../prisma/client")
const bcrypt = require("bcrypt")
const { jwtToken } = require("../utils/jwtutil")
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("./emailService");

async function forgotPassword(email, frontendUrl) {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    // Same response whether the account exists or not.
    if (!user) {
        return {
            message: "If that email exists, a reset link has been sent."
        };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    await prisma.user.update({
        where: { email },
        data: {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000)
        }
    });

    const resetUrl =
        `${frontendUrl}/resetPassword?token=${resetToken}`;

    await sendPasswordResetEmail(email, resetUrl);

    return {
        message: "If that email exists, a reset link has been sent."
    };
}

async function signup(detail) {
    let { name, password, email } = detail
    if (!name || !password || !email ) {
        throw new Error("Name, email and password are required")
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
                // phoneNumber: phoneNumber,
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
        },"1h")
        const refreshToken = jwtToken({ userId: user.id }, "7d")
        return {
            message: "Login successful",
            token,
            refreshToken
        }
    }
    catch (err) {
        throw new Error(err.message)
    }

}

// async function forgotPassword(email,newPassword) {
//     try{
//         let user = await prisma.user.findUnique({
//             where:{
//                 email:email
//             }
//         })
//         if (!user){
//             throw new Error ("User Not Found! Create an account first.")
//         }
//         let newHash = await bcrypt.hash(newPassword,10)
//         let account = await prisma.user.update({
//             where:{
//                 email:email
//             },
//             data:{
//                 password:newHash
//             }
//         })
//         return {message:"Password Updated Successfully"}
//     }
//      catch (err) {
//         throw new Error(err.message)
//     }
    
// }
async function resetPassword(token, newPassword) {
    const crypto = require("crypto");

    if (!token || !newPassword) {
        throw new Error("Token and new password are required");
    }

    if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters");
    }

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await prisma.user.findFirst({
        where: {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { gt: new Date() }
        }
    });

    if (!user) {
        throw new Error("Reset link is invalid or expired");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        }
    });

    return { message: "Password reset successfully" };
}
module.exports = { signup, login,forgotPassword,resetPassword }