const express = require('express')
const userController = require('./user.controllers.js')

const router = express.Router()

router.post("/users", userController.createUser)
router.get("/users", userController.getUsers)
router.get("/users/:id", userController.getUserById)
router.put("/users/:id", userController.updateUser)
router.delete("/users/:id", userController.removeUser)

module.exports = router
