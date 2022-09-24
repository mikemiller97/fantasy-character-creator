const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const HttpError = require('../models/http-error')
const User = require("../models/user-schema")

const postNewUser = async (req, res, next) => {
    // Checks if middleware validation failed
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next( new HttpError("Invalid input, please check your input", 422))
    }
    
    const {email, password, picture} = req.body

    let existingUser
    try {
        existingUser = await User.findOne({ email })
    } catch (err) {
        const error = new HttpError("Signing up failed, please try again later", 500)
        return next(error)
    } 

    if (existingUser) {
        const error = new HttpError("User already exists, please log in instead", 422)
        return next(error)
    }
    
    // Encrypts password
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
        const error = new HttpError("Could not create user, please try again", 500)
        return next(error)
    }
    
    const newUser = new User({
        email,
        password: hashedPassword,
        picture,
        characters: []
    })

    try {
        await newUser.save()
    } catch(err) {
        const error = new HttpError("Error: account not created, please try again later", 500)
        return next(error)
    }

    // Generates token
    let token
    try {
        token = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.TOKEN, {expiresIn: "1h"})
    } catch (err) {
        const error = new HttpError("Error: account not created, please try again later", 500)
        return next(error)
    }

    res.status(201).json({ userId: newUser.id, email: newUser.email, token: token })
}

const loginUser = async (req, res, next) => {
    const {email, password} = req.body

    let existingUser
    
    try {
        existingUser = await User.findOne({ email })
    } catch (err) {
        const error = new HttpError("Log in failed, please try again later", 500)
        return next(error)
    } 

    if(!existingUser) {
        const error = new HttpError("Invalid credentials, could not log in", 401)
        return next(error)
    }

    // Verifies password is correct
    let isValidPassword = false
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (err) {
        const error = new HttpError("Error: log in failed, please try again later", 500)
        return next(error)
    }

    if (!isValidPassword) {
        const error = new HttpError("Invalid credentials, could not log in", 401)
        return next(error)
    }

    // Generates token
    let token
    try {
        token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, process.env.TOKEN, {expiresIn: "1h"})
    } catch (err) {
        const error = new HttpError("Error: log-in failed, please try again later", 500)
        return next(error)
    }

    res.status(200).json({ userId: existingUser.id, email: existingUser.email, token: token })
}

const changePassword = async (req, res, next) => {
    // Checks if middleware validation failed
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next( new HttpError("Invalid input, please check your input", 422))
    }
    
    const {userId, oldPassword, newPassword, confirmNewPassword} = req.body

    let existingUser
    // Checks if user is in database
    try {
        existingUser = await User.findById(userId)
    } catch (err) {
        const error = new HttpError("Error: your account could not be found", 404)
        return next(error)
    }

    // Verifies the new password and confirmation of new password match
    if (confirmNewPassword !== newPassword) {
        const error = new HttpError("Invalid input, your new password and the confirmation of it do not match", 422)
        return next(error)
    }

    // Verifies old password is the same as what was in the database
    let isValidPassword = false
    try {
        isValidPassword = await bcrypt.compare(oldPassword, existingUser.password)
    } catch (err) {
        const error = new HttpError("Error: log in failed, please try again later", 500)
        return next(error)
    }

    if (!isValidPassword) {
        const error = new HttpError("Error: the old password you entered is incorrect", 401)
        return next(error)
    }

    // Encrypts password
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(newPassword, 12)
    } catch (err) {
        const error = new HttpError("Could not change password, please try again", 500)
        return next(error)
    }

    // Updates user profile
    existingUser.password = hashedPassword

    // Saves new user data
    try {
        await existingUser.save()
    } catch (err) {
        const error = new HttpError("Something went wrong, could not change password", 500)
        return next(error)
    }

    res.status(200).json({ message: "password changed succsessfully" })
}

const changeEmail = async (req, res, next) => {
    // Checks if middleware validation failed
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next( new HttpError("Invalid input, please check your input", 422))
    }
    
    const {userId, password, newEmail} = req.body

    let existingUser
    // Checks if user is in database
    try {
        existingUser = await User.findById(userId)
    } catch (err) {
        const error = new HttpError("Error: your account could not be found", 404)
        return next(error)
    }

    // Verifies password is correct
    let isValidPassword = false
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (err) {
        const error = new HttpError("Error: log in failed, please try again later", 500)
        return next(error)
    }

    if (!isValidPassword) {
        const error = new HttpError("Invalid credentials, could not log in", 401)
        return next(error)
    }

    // Updates user profile
    existingUser.email = newEmail

     // Saves new user data
     try {
        await existingUser.save()
    } catch (err) {
        const error = new HttpError("Something went wrong, could not change password", 500)
        return next(error)
    }

    res.status(200).json({ message: "email changed succsessfully" })

}

const deleteUser = async (req, res, next) => {
    const userId = req.params.uid
    let existingUser
    
    // Finds user in database
    try {
        existingUser = await User.findById(userId)
    } catch (err) {
        const error = new HttpError("Error: your account could not be found", 404)
        return next(error)
    }

    // Deletes user
    try {
        await User.findByIdAndDelete(userId)

    } catch (err) {
        const error = new HttpError("Something went wrong, could not delete your account", 500)
        return next(error)
    }

    res.status(200).json({message: "Deleted account"})
}

module.exports = { postNewUser, loginUser, changePassword, changeEmail, deleteUser}