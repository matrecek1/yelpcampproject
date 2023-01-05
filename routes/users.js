const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users.js");
const { getUrl } = require("../middleware.js");

router.get("/register", users.renderRegisterForm);

router.post("/register", catchAsync(users.registerUser));

router.get("/login", users.renderLoginForm);

router.post("/login", getUrl, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.loginUser);

router.get("/logout", users.logoutUser);

module.exports = router;
