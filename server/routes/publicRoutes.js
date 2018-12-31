//////////////////////////////////////////////////
//            modules
/////////////////////////////////////////////////
const express = require('express')
const router = express.Router();
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

//////////////////////////////////////////////////
//            controllers
/////////////////////////////////////////////////
const User_CONTROLLER = require('../controllers/User')
const authentication_CONTROLLER = require('../controllers/Authentication')

//////////////////////////////////////////////////
//            authentication
/////////////////////////////////////////////////
const user_AUTHENTICATION = require("../config/auth");

passport.use("user", user_AUTHENTICATION.local_strategy_INITIALIZE);

passport.serializeUser(user_AUTHENTICATION.passport_serialize_INITIALIZE);

passport.deserializeUser(user_AUTHENTICATION.passport_deserialize_INITIALIZE);

///////////////////////////
////    Routes
///////////////////////////
router.get("/login/:msg?", authentication_CONTROLLER.login_REQUEST);

router.post("/login", passport.authenticate("user", authentication_CONTROLLER.login_RESPONSE));

router.get("/logout", authentication_CONTROLLER.logout_REQUEST);

router.post("/register", authentication_CONTROLLER.register_POST);

//////////////////////////////////////////////////
//            router
/////////////////////////////////////////////////

module.exports = router;