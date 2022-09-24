const { validationResult } = require("express-validator")
const mongoose = require("mongoose")

const cloudinary = require("../utils/cloudinary")
const HttpError = require("../models/http-error")
const Character = require("../models/character-schema")
const User = require("../models/user-schema")

const getCharactersByUserId = async (req, res, next) => {
    const creatorId = req.params.cid
    let characters

    try {
        characters = await Character.find({ creator : creatorId })
    } catch (err) {
        const error = new HttpError("Something went wrong, could not find the character", 500)
        return next(error) 
    }

    if (!characters || characters.length === 0) {
        const error = new HttpError("You have no saved characters", 404)
        return next(error)
    }
    res.json({ characters: characters.map(character => character.toObject({ getters: true })) })
}

const getCharacterByCharacterId = async (req, res, next) => {
    const characterId = req.params.cid
    let character
    
    try {
        character = await Character.findById(characterId)
    } catch (err) {
        const error = new HttpError("Something went wrong, could not find the character", 500)
        return next(error)
    }

    if (!character) {
        const error = new HttpError("Character could not be found", 404)
        return next(error)
    }

    res.json({ character: character.toObject( { getters: true }) })
}

const postCharacter = async (req, res, next) => {
    // Checks if middleware validation failed
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid input, please check your input", 422))
    }

    const { name, race, sex, profession, playerClass, creator, picture, bio, alignmentLaw, alignmentMoral, age, publicId } = req.body

    const createdCharacter = new Character({
        name,
        race,
        sex,
        profession,
        playerClass,
        creator,
        picture,
        bio,
        alignmentLaw,
        alignmentMoral,
        age,
        publicId
    })

    let user

    try {
        user = await User.findById(creator)
    } catch(err) {
        const error = new HttpError("Creating character failed, please try again", 500)
        return next(error)
    }

    if (!user) {
        const error = new HttpError("Could not find user for provided ID", 404)
        return next(error)
    }

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await createdCharacter.save({ session: sess })
        user.characters.push(createdCharacter)
        await user.save({ session: sess })
        await sess.commitTransaction()

    } catch (err) {
        const error = new HttpError("Creating character failed, please try again", 500)
        return next(error)
    }
    res.status(201).json({chracter: createdCharacter})
}

const patchCharacter = async (req, res, next) => {
    // Checks if middleware validation failed
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpError("Invalid input, please check your input", 422)
    }

    console.log(req.body)
    
    const { name, race, sex, profession, playerClass, picture, bio, alignment, age, publicId, pictureChanged, oldPublicId } = req.body
    const characterId = req.params.cid

    if (pictureChanged) {
        try {
            await cloudinary.uploader.destroy(oldPublicId)
        } catch (err) {
            const error = new HttpError("Something went wrong, could not update", 500)
            return next(error)
        }
    }

    let updatedCharacter

    try {
        updatedCharacter = await Character.findById(characterId)
    } catch (err) {
        const error = new HttpError("Something went wrong, could not find character", 500)
        return next(error)
    }

    updatedCharacter.name = name
    updatedCharacter.race = race
    updatedCharacter.sex = sex
    updatedCharacter.profession = profession
    updatedCharacter.playerClass = playerClass
    updatedCharacter.picture = picture
    updatedCharacter.bio = bio
    updatedCharacter.alignment = alignment
    updatedCharacter.age = age
    updatedCharacter.publicId = publicId

    try {
        await updatedCharacter.save()
    } catch (err) {
        const error = new HttpError("Something went wrong, could not update character", 500)
        return next(error)
    }

    res.status(200).json({ updatedCharacter: updatedCharacter.toObject( {getters: true }) })
}

// Deletes character while still preserving user list of characters
const deleteCharacter = async (req, res, next) => {
    const characterId = req.params.cid
    let character

    try {
        character = await Character.findById(characterId).populate("creator")
    } catch (err) {
        const error = new HttpError("Something went wrong, could not delete character", 500)
        return next(error)
    }

    if (!character) {
        const error = new HttpError("Could not find character for this ID", 404)
        return next(error)
    }

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        if (character.publicId.length > 1) {
            console.log(await cloudinary.uploader.destroy(character.publicId))
        }
        await character.remove({ session: sess })
        character.creator.characters.pull(character)
        await character.creator.save({ session: sess })
        await sess.commitTransaction()
    } catch (err) {
        const error = new HttpError("Something went wrong, could not delete character", 500)
        return next(error)
    }

    res.status(200).json({message: "Deleted character"})
}

// Deletes characters in case of an account deletion
const deleteCharacterBlind = async (req, res, next) => {
    const characterId = req.params.cid
    let character

    try {
        character = await Character.findById(characterId)
    } catch (err) {
        const error = new HttpError("Something went wrong, could not delete character", 500)
        return next(error)
    }

    if (!character) {
        const error = new HttpError("Could not find character for this ID", 404)
        return next(error)
    }

    if (character.publicId.length > 1) {
        try {
            await cloudinary.uploader.destroy(character.publicId)
        } catch (err) {
            const error = new HttpError("Something went wrong, could not delete character", 500)
            return next(error)
        }
    }

    try {
        await Character.findByIdAndRemove(characterId)
    } catch (err) {
        const error = new HttpError("Something went wrong, could not delete character", 500)
        return next(error)
    }

    res.status(200).json({message: "Deleted character"})
}

module.exports = {getCharactersByUserId, getCharacterByCharacterId, postCharacter, patchCharacter, deleteCharacter, deleteCharacterBlind}