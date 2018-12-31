const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

UserSchema.pre("save", function(next) {
    let User = this;

    this.hashPassword(User.password, function(err, hash) {
        if (err) {
            return next(err);
        }

        User.password = hash;
        next();
    });
});

UserSchema.methods.hashPassword = function(candidatePassword, cb) {
    bcrypt.genSalt(13, function(err, salt) {
        if (err) {
            return cb(err);
        }
        bcrypt.hash(candidatePassword, salt, null, function(err, hash) {
            if (err) {
                return cb(err);
            }
            return cb(null, hash);
        });
    });
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

let User = (module.exports = mongoose.model("User", UserSchema));