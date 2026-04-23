/* eslint-disable no-undef */
require("dotenv").config()

const express = require("express")
const cors = require("./config/cors")
const authRoute = require("./routes/auth.route")
const adminRoute = require("./routes/adminRoute")
const cart = require("./routes/cartRoute")
const order = require("./routes/orderRoute")
const adminOrder = require("./routes/adminOrder")
const payment = require("./routes/payment.route.js")
const address = require("./routes/addressRoute.js")

const app = express()
app.use(express.json())
app.use(cors)
app.use("/auth",authRoute)
app.use("/cart", cart)
app.use("/order",order)
app.use("/admin",adminOrder)
app.use("/admin", adminRoute)
app.use("/payment", payment);
app.use("/address",address)


app.get("/",(req,res)=>(
    res.status(200).send("Hello")
))

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});