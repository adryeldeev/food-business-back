const express = require('express');
const userController = require('./user.controllers.js');
const { authenticateToken } = require('../../middlewares/auth');

const router = express.Router();

router.post('/users', userController.createUser);
router.post('/users/login', userController.login);

router.get('/users', authenticateToken, userController.getUsers);
router.get('/users/:id', authenticateToken, userController.getUserById);
router.put('/users/:id', authenticateToken, userController.updateUser);
router.delete('/users/:id', authenticateToken, userController.deleteUser);

module.exports = router;