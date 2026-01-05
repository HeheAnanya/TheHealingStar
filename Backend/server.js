/* eslint-disable no-undef */
require("dotenv").config()

const express = require("express")
const cors = require("./config/cors")
const authRoute = require("./routes/auth.route")
const adminRoute = require("./routes/adminRoute")
const cart = require("./routes/cartRoute")
const order = require("./routes/orderRoute")
const adminOrder = require("./routes/adminOrder")

const app = express()
app.use(express.json())
app.use(cors)
app.options("*", cors)



app.use("/auth",authRoute)
app.use("/cart", cart)
app.use("/order",order)
app.use("/admin",adminOrder)


app.get("/",(req,res)=>(
    res.status(200).send("Hello")
))


app.listen(3000,()=>(console.log("Server is running")))


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiQWRtaW4xQHRlc3QuY29tIiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzY3MzQxNjgzLCJleHAiOjE3NjczNDUyODN9.pKVftf8qY1oNBLBbuih9pG1pVDT8nzZh4kA5Mbca7tg