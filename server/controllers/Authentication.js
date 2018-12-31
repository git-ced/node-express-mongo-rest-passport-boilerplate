// models
const User = require('../models/User')

//controllers
exports.login_REQUEST = (req, res) => {
    res.render("../../client/views/pages/login", {
        title: "Boilerplate | Login"
    });
};

exports.login_RESPONSE = {
    successRedirect: "/profile?success=Signed in successfully!",
    failureRedirect: "/login?error=Invalid credentials",
    failureFlash: true
};

exports.logout_REQUEST = (req, res) => {
    req.logout();
    res.redirect("/login");
};

exports.register_POST = (req, res) => {
    const user = new User();
    user.firstName = req.body.firstName;
    user.middleName = req.body.middleName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.contact = req.body.contact;
    user.role = req.body.role;
    user.password = req.body.password;

    user.save(err => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/login?success=Registered Successfully");
        }
    });
};