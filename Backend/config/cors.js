/* eslint-disable no-undef */
const cors = require("cors")
const options = {
    origin:["http://localhost:5174",
        "https://the-healing-star.vercel.app"
    ],
    methods:["GET","PUT","POST","PATCH","DELETE","OPTIONS"],
    allowedHeaders:["Content-Type", "Authorization"],
    credentials: true
}
module.exports = cors(options)