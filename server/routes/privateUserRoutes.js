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
const user_CONTROLLER = require('../controllers/User')
const authentication_CONTROLLER = require('../controllers/Authentication')

//////////////////////////////////////////////////
//            authentication
/////////////////////////////////////////////////
const user_AUTHENTICATION = require("../config/auth");

const userLogin = user_AUTHENTICATION.check_auth_INITIALIZE;

passport.use("user", user_AUTHENTICATION.local_strategy_INITIALIZE);

passport.serializeUser(user_AUTHENTICATION.passport_serialize_INITIALIZE);

passport.deserializeUser(user_AUTHENTICATION.passport_deserialize_INITIALIZE);

///////////////////////////
////    Routes
///////////////////////////

router.get("/profile/:msg?", userLogin, user_CONTROLLER.index_GET);

//////////////////////////////////////////////////
//            router
/////////////////////////////////////////////////

module.exports = router;