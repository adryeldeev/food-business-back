const userController = require('./user.controllers.js')
const { authenticateToken } = require('../../middlewares/auth.js')
const express = require('express')

const router = express.Router()

router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)

router.get('/profile', authenticateToken, userController.getProfile)

router.get('/', authenticateToken, userController.getUsers)
router.get('/:id', authenticateToken, userController.getUserById)
router.put('/:id', authenticateToken, userController.updateUser)     
router.delete('/:id', authenticateToken, userController.deleteUser) 

module.exports = router