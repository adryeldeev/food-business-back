const userController = require('./user.controllers.js')
const { authenticateToken } = require('../../middlewares/auth.js')
const express = require('express')

const router = express.Router()

// Rotas públicas (não precisam de autenticação)
router.post('/register', userController.createUser)           // POST /users/register - Registrar usuário
router.post('/login', userController.loginUser)               // POST /users/login - Login do usuário

// Rotas protegidas (precisam de autenticação)
router.get('/profile', authenticateToken, userController.getProfile)  // GET /users/profile - Perfil do usuário logado

// Rotas administrativas (precisam de autenticação)
router.get('/', authenticateToken, userController.getUsers)           // GET /users - Listar todos os usuários
router.get('/:id', authenticateToken, userController.getUserById)     // GET /users/:id - Buscar usuário por ID
router.put('/:id', authenticateToken, userController.updateUser)      // PUT /users/:id - Atualizar usuário
router.delete('/:id', authenticateToken, userController.deleteUser)   // DELETE /users/:id - Excluir usuário

module.exports = router
