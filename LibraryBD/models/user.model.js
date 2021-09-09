const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        dob:Date,
        email: String,
        password: String,
        mobile:String,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ],
        authorization: {
            type: Boolean,
            default: false
        },
        borrows:[{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'books'
            },
            borrowdate: {
                type: Date,
                default: Date.now
            },
            submissiondate: {
                type: Date,
                default: Date.now
            }
        }],
    })
);

module.exports = User;
