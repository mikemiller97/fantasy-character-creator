const express = require("express")
const { check } = require("express-validator")

const HttpError = require('../models/http-error')
const { postNewUser, loginUser, changePassword, changeEmail, deleteUser} = require('../controllers/user-controller')
const checkAuth = require('../middleware/check-auth')

const router = express.Router()

router.post("/signup", 
[
    check("email")
        .normalizeEmail()
        .isEmail(),
    check("password")
        .isLength({ min: 6 })   
] , postNewUser)

router.post("/login", loginUser)

// Protects routes with token
router.use(checkAuth)

router.patch("/changepassword", check("newPassword").isLength({ min: 6 }), changePassword)

router.patch("/changeemail", check("newEmail").normalizeEmail().isEmail(), changeEmail)

router.delete("/:uid", deleteUser)

module.exports = router