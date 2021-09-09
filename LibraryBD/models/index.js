const dbConfig = require("../config/db.config.js");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.url =dbConfig.url;  
db.user = require('./user.model');
db.books = require("./book.model.js")(mongoose);
db.role = require("./role.model");

db.ROLES = ["user","admin"];

module.exports = db;
