const enderecoController = require('./endereco.controllers.js')
const { authenticateToken } = require('../../middlewares/auth.js')
const express = require('express')

const router = express.Router()

// Rotas do usuário logado (COM authenticateToken em cada uma)
router.post('/', authenticateToken, enderecoController.createEndereco)                    // POST /enderecos - Criar endereço
router.get('/', authenticateToken, enderecoController.getEnderecos)                       // GET /enderecos - Listar endereços do usuário
router.get('/:id', authenticateToken, enderecoController.getEnderecoById)                 // GET /enderecos/:id - Buscar endereço por ID
router.put('/:id', authenticateToken, enderecoController.updateEndereco)                  // PUT /enderecos/:id - Atualizar endereço
router.delete('/:id', authenticateToken, enderecoController.deleteEndereco)               // DELETE /enderecos/:id - Excluir endereço

// Rota administrativa (todos os endereços)
router.get('/admin/all', authenticateToken, enderecoController.getAllEnderecos)           // GET /enderecos/admin/all - Listar todos os endereços

module.exports = router