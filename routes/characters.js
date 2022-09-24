const express = require("express")
const { check } = require("express-validator")

const {getCharactersByUserId, postCharacter, patchCharacter, deleteCharacter, getCharacterByCharacterId, deleteCharacterBlind} = require("../controllers/characters-controller")
const checkAuth = require('../middleware/check-auth')

const router = express.Router()

// Protects routes with token
router.use(checkAuth)

router.get("/userid/:cid", getCharactersByUserId)
router.get("/:cid", getCharacterByCharacterId)

router.post("/", check("name").not().isEmpty(),
    postCharacter)

router.patch("/:cid", check("name").not().isEmpty(), patchCharacter)

router.delete("/withaccount/:cid", deleteCharacterBlind)
router.delete("/:cid", deleteCharacter)

module.exports = router