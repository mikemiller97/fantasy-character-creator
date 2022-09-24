const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    picture: { type: String, required: false },
    characters: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }]
})

// Makes sure that email in unique in database
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema)