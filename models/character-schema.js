const mongoose = require("mongoose")

const Schema = mongoose.Schema

const characterSchema = new Schema({
    name: { type: String, required: true},
    race: { type: String, required: false },
    sex: { type: String, required: false },
    profession: { type: String, required: false },
    playerClass: { type: String, required: false },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    picture: { type: String, required: false },
    bio: { type: String, required: false },
    alignmentLaw: {type: String, required: false},
    alignmentMoral: {type: String, required: false},
    age: {type: String, required: false},
    publicId: {type: String, required: false}
})

module.exports = mongoose.model("Character", characterSchema)