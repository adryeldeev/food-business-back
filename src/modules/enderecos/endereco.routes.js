const enderecoController = require('./endereco.controllers.js')
const { authenticateToken } = require('../../middlewares/auth.js')
const express = require('express')

const router = express.Router()

// Todas as rotas precisam de autenticação
router.use(authenticateToken)

// Rotas do usuário logado
router.post('/', authenticateToken, enderecoController.createEndereco)                    // POST /enderecos - Criar endereço
router.get('/', authenticateToken, enderecoController.getEnderecos)                       // GET /enderecos - Listar endereços do usuário
router.get('/:id', authenticateToken, enderecoController.getEnderecoById)                 // GET /enderecos/:id - Buscar endereço por ID
router.put('/:id', authenticateToken, enderecoController.updateEndereco)                  // PUT /enderecos/:id - Atualizar endereço
router.delete('/:id',  authenticateToken, enderecoController.deleteEndereco)               // DELETE /enderecos/:id - Excluir endereço

// Rota administrativa (todos os endereços)
router.get('/admin/all', authenticateToken, enderecoController.getAllEnderecos)           // GET /enderecos/admin/all - Listar todos os endereços

module.exports = router
