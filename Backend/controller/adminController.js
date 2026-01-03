/* eslint-disable no-undef */
async function admin(req,res){
    return res.status(200).json({
        message: "Admin Route Working",
    admin: req.user
    })
}
module.exports = {admin}