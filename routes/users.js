const express = require("express")
const path = require("path")
const bodyParser = require('body-parser');

const User = require("../models/user");
const passport = require("passport");

const userRouter = express.Router()

userRouter.use(bodyParser.urlencoded({extended: false})); 

userRouter.route("/register")
.get((request, response) => {
    response.sendFile(path.join(__dirname, "..", "public", "register.html"))
})
.post((request, response) => {
    console.log(request.body)
    const user = new User({
        firstname: request.body.firstname,
        lastname: request.body.lastname,
        username: request.body.username
    })
    User.register(user, request.body.password)
    .then(user => {
        request.session = user
        console.log(user)
        return response.redirect("/users/login")
    })
    .catch(err => {
        return response.status(403).json(err)
    })
})

userRouter.route("/login")
.get((request, response) => {
    response.sendFile(path.join(__dirname, "..", "public", "login.html"))
})
.post(passport.authenticate('local', {failureRedirect: "/users/register"}), (request, response) => {
        response.redirect("/files/")
    })

userRouter.get("/all", (request, response) => {
    User.find()
        .then(user => {
            response.json(user)
        })
        .catch(error => response.json(error))
})
module.exports = userRouter