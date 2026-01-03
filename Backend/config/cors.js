const cors = require("cors")
const options = {
    origin:["http://localhost:5173",
        "https://thehealingstar.onrender.com"
    ],
    methods:["GET","PUT","POST","DELETE"],
    allowedHeaders:["Content-Type", "Authorization"],
    credentials: true
}
module.exports = cors(options)