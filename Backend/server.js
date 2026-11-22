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
const calendly = require("./routes/calendlyRoute")
const servicePackages = require("./routes/servicePackageRoute")
const adminServicePackages = require("./routes/adminServicePackageRoute")
const servicePayments = require("./routes/servicePaymentRoute")
const calendlyWebhook = require("./routes/calendlyWebhookRoute")
const cookieParser = require("cookie-parser");

const app = express()
app.use(express.json({ verify: (req, res, buffer) => { req.rawBody = buffer.toString("utf8"); } }))
app.use(cookieParser())
app.use(cors)
app.use("/auth",authRoute)
app.use("/cart", cart)
app.use("/order",order)
app.use("/admin",adminOrder)
app.use("/admin", adminRoute)
app.use("/payment", payment);
app.use("/address",address)
app.use("/admin/calendly", calendly)
app.use("/services", servicePackages)
app.use("/admin/service-packages", adminServicePackages)
app.use("/payment/service", servicePayments)
app.use("/calendly", calendlyWebhook)


app.get("/",(req,res)=>(
    res.status(200).send("Hello")
))

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});