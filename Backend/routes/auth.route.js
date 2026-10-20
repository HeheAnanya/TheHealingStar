// /* eslint-disable no-undef */
// const express = require("express")
// const router = express.Router() 

// const {signup,login,forgotPassword,refreshTokenHandler} = require("../controller/auth.controller")

// router.post("/signup",signup)
// router.post("/login",login)
// router.put("/forgotPassword",forgotPassword)
// router.post("/refresh", refreshTokenHandler)

// module.exports = router

/* eslint-disable no-undef */
const express = require("express");
const passport = require("../services/googleAuthService");


const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  refreshTokenHandler,
  googleCallback
} = require("../controller/auth.controller");

router.post("/signup", signup);
router.post("/login", login);
router.put("/forgotPassword", forgotPassword);
router.post("/refresh", refreshTokenHandler);
router.post("/resetPassword", resetPassword);

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/google/failure",
  }),
  googleCallback
);

// Handle failed Google login
router.get("/google/failure", (req, res) => {
  res.status(401).send("Google authentication failed. Please try again.");
});

module.exports = router;