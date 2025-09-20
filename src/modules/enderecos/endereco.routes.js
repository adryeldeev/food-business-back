const enderecoController = require('./endereco.controllers.js')
const { authenticateToken } = require('../../middlewares/auth.js')
const express = require('express')

const router = express.Router()

// Todas as rotas precisam de autenticação
router.use(authenticateToken)

// Rotas do usuário logado
router.post('/', enderecoController.createEndereco)                    // POST /enderecos - Criar endereço
router.get('/', enderecoController.getEnderecos)                       // GET /enderecos - Listar endereços do usuário
router.get('/:id', enderecoController.getEnderecoById)                 // GET /enderecos/:id - Buscar endereço por ID
router.put('/:id', enderecoController.updateEndereco)                  // PUT /enderecos/:id - Atualizar endereço
router.delete('/:id', enderecoController.deleteEndereco)               // DELETE /enderecos/:id - Excluir endereço

// Rota administrativa (todos os endereços)
router.get('/admin/all', enderecoController.getAllEnderecos)           // GET /enderecos/admin/all - Listar todos os endereços

module.exports = router
