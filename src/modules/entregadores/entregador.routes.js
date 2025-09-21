const entregadorController = require('./entregador.controllers.js')
const { authenticateToken } = require('../../middlewares/auth.js')
const express = require('express')

const router = express.Router()

// Todas as rotas precisam de autenticação
router.use(authenticateToken)

// Rotas do entregador logado
router.post('/', authenticateToken, entregadorController.createEntregador)                    // POST /entregadores - Criar perfil de entregador
router.get('/me', authenticateToken, entregadorController.getMeuPerfil)                       // GET /entregadores/me - Perfil do entregador logado
router.put('/me', authenticateToken, entregadorController.updateMeuPerfil)                    // PUT /entregadores/me - Atualizar perfil do entregador
router.delete('/me', authenticateToken, entregadorController.deleteMeuPerfil)                 // DELETE /entregadores/me - Excluir perfil de entregador
router.get('/verificar', authenticateToken, entregadorController.verificarEntregador)         // GET /entregadores/verificar - Verificar se é entregador

// Rotas administrativas
router.get('/', authenticateToken, entregadorController.getEntregadores)                      // GET /entregadores - Listar todos os entregadores
router.get('/:id', authenticateToken, entregadorController.getEntregadorById)                 // GET /entregadores/:id - Buscar entregador por ID

module.exports = router
