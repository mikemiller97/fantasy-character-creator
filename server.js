const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.static(path.join(__dirname, "/client/build")))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set("port", process.env.PORT || "5000")

app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(app.get("port"), function(){
    console.log("Express server listening on port " + app.get("port"));
});