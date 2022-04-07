const express = require("express")
const path = require("path")
const bodyParser = require('body-parser');
const multer = require("multer")

const fileUpload = require("../models/upload")
const fs = require("fs");
const {request, response} = require("express");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file)
        cb(null, "./files")
    },
    filename: (req, file, cb) => {

        let time2 = new Date().toJSON().split(":")
        time2 = time2[0] + time2[1] + time2[2]
        console.log(time2)
        cb(null, time2 + file.originalname)
    }
})

const upload = multer({storage: storage})
const fileRouter = express.Router()

fileRouter.use(bodyParser.json());

fileRouter.route('/')
    .get((req, res, next) => {
        res.sendFile(path.join(__dirname, "..", "public", "upload.html"))
    })
    .post(upload.single("fileUpload"), (request, response) => {
        if (request.file != null) {
            console.log(request.file)
            const files = new fileUpload({
                name: request.file.filename
            })
            files.save()
                .then(file => {
                    response.end("Sent File")
                })
                .catch(err => console.error(err))
        }

    })

fileRouter.get("/all", (request, response) => {
    fileUpload.find()
        .then(file => {
            response.json(file)
        })
})

fileRouter.get("/delete", (request, response) => {
    fileUpload.deleteMany({})
        .then(file => {
            console.log(file);
            fs.rmdir(path.join(__dirname, "..", "files"), {recursive: true}, err => console.error(err))
            fs.mkdir(path.join(__dirname, "..", "files"))
            response.redirect("all")
        })
})
fileRouter.all("/delete/:delete", (request, response) => {
    console.log(request.params.delete, path.join(__dirname, "..", "files", request.params.delete))
    fs.unlink(path.join(__dirname, "..", "files", request.params.delete), err => {
        if (err && err.code === "ENOENT") {
            response.status(404).json({msg: "Error! File doesn't exist."});
        } else if (err) {
            response.status(404).json({msg: "Something went wrong. Please try again later."});
        } else {
            fileUpload.findOneAndRemove({name: request.params.delete})
                .then(_ => response.json({msg: "File Deleted"}))
                .catch(error => console.error(error))
        }
    });

})

fileRouter.get("/:files", (request, response) => {
    const file = request.params.files
    if (file !== null) {
        const filename = decodeURI(file.split("Z")[1])
        return response.download(path.join(__dirname, "..", "files", file), filename)
    }
    return response.json({msg: "Sorry It can't be completed"})
})
fileRouter.get("/video/:files", (request, response) => {
    const file = request.params.files
    if (file !== null) {
        return response.sendFile(path.join(__dirname, "..", "files", file))
    }
    return response.json({msg: "Sorry It can't be completed"})
})

module.exports = fileRouter