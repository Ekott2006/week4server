var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose")

var Schema = mongoose.Schema;

var User = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    }
});

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User);