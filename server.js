const express = require("express")

const PORT = process.env.PORT || 5000

const app = express()

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})