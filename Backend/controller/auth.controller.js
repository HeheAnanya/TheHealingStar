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

module.exports = { signup, login }