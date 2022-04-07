const express = require("express")
const cors = require("cors")

const PORT = 3000
const whitelist = ["http://localhost:5000", 'https://stackoverflow.com']

const app = express()

const corsOption = {
    origin: (origin, callback) => {
        console.log(whitelist.indexOf(origin), origin)
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        }
        else {
            callback("CORS is blocked SORRY!!!")
        }     
    }
}

app.get("/", cors(corsOption), (request, response) => {
    response.json({name: "Nsikak Ekott"})
})

app.options('/', cors(corsOption))
app.delete("/",  (request, response) => {
    response.json({name: "Nsikak Ekott", age: 15})
})
app.listen(PORT, () => console.log(`Server running at localhost:${PORT}`))