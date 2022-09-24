const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const mongoose = require("mongoose")
const cors = require("cors")

const userRoutes = require("./routes/user")
const characterRoutes = require("./routes/characters")
const HttpError = require("./models/http-error")

// Path to environmental variables
require('dotenv').config({ path: path.resolve(__dirname, './config/dev.env')})

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.static(path.join(__dirname, "/client/build")))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Alows cors requests from browser
app.use(cors())

app.set("port", process.env.PORT || "5000")

// Serves React web page
app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

//Parses incoming requests and obtains body info from themm
app.use(bodyParser.json())

// Defines routes
app.use("/api/characters", characterRoutes)
app.use("/api/users", userRoutes)

// 404 error when no route matches
app.use((req, res, next) => {
    const error = new HttpError("Error: page not found", 404)
    return next(error)
})

// Error handler
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message: error.message || "An unknown error occured"})
})

mongoose
    .connect(process.env.ATLAS_URI)
    .then(() => {
        app.listen(app.get("port"), function(){
            console.log("Express server listening on port " + app.get("port"));
        });
    })
    .catch(err => {console.log(err)})
