/* eslint-disable no-undef */
const express = require("express")
require("dotenv").config()
const cors = require("./config/cors")
const authRoute = require("./routes/auth.route")
const app = express()
app.use(express.json())
app.use(cors)
app.use("/auth",authRoute)
app.get("/",(req,res)=>(
    res.status(200).send("Hello")
))


app.listen(3000,()=>(console.log("Server is running")))
