const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport")
const session = require("express-session")
const cors = require('cors')

const fileRouter = require("./routes/fileUpload")
const Strategy = require("./authenticate")
const users = require("./routes/users")

Strategy(passport)
const url = "mongodb://localhost:27017/testCode"
mongoose.connect(url).then(_ => console.log("MongoDB Connected"))

const app = express()

app.use(passport.initialize())
app.use(passport.session())
app.use(cors())
app.use("/users", users)
// app.use(Authorization)
app.use('/files', fileRouter)

function Authorization (request, response, next) {
    console.log(request.url, request.method, request.isAuthenticated(), request.user)
    if (request.isAuthenticated()) { next() }
    else {
        if (request.url === '/users/login' || request.url === "/users/register") { next() }
        else { response.redirect("/users/login")}
    }
}

app.listen(5000, () => console.log("Server Running"))