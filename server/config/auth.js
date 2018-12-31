// passport
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// models
const Users = require("../models/User");

// auth logic
exports.check_auth_INITIALIZE = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login"); // login page
};

exports.local_strategy_INITIALIZE = new LocalStrategy({
        // by default, local strategy uses email and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    (req, regi, password, done) => {
        // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        Users.findOne({
                email: regi
            },
            (err, user) => {
                // if there are any errors, return the error before anything else
                if (err) return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, {
                        message: "Invalid Credentials"
                    }); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password)) {
                    return done(null, false, {
                        message: "Invalid Credentials"
                    });
                } // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user);
            }
        );
    }
);

exports.passport_serialize_INITIALIZE = (user, done) => {
    done(null, user.id);
};
exports.passport_deserialize_INITIALIZE = (id, done) => {
    Users.findById(id, (err, user) => {
        if (err) done(err);
        if (user) {
            done(null, user);
        }
    });
};