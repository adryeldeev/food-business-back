const pedidoController = require('./pedido.controllers.js')
const { authenticateToken } = require('../../middlewares/auth.js')
const express = require('express')

const router = express.Router()

// Todas as rotas precisam de autenticação
router.use(authenticateToken)

// Rotas do usuário logado
router.post('/', pedidoController.createPedido)                            // POST /pedidos - Criar pedido
router.get('/', pedidoController.getPedidos)                               // GET /pedidos - Listar pedidos do usuário
router.get('/estatisticas', pedidoController.getEstatisticas)             // GET /pedidos/estatisticas - Estatísticas do usuário
router.get('/:id', pedidoController.getPedidoById)                         // GET /pedidos/:id - Buscar pedido por ID
router.patch('/:id/status', pedidoController.updateStatusPedido)           // PATCH /pedidos/:id/status - Atualizar status do pedido
router.patch('/:id/cancelar', pedidoController.cancelarPedido)             // PATCH /pedidos/:id/cancelar - Cancelar pedido

// Rotas administrativas
router.get('/admin/all', pedidoController.getAllPedidos)                   // GET /pedidos/admin/all - Listar todos os pedidos
router.get('/admin/estatisticas', pedidoController.getEstatisticasGerais)  // GET /pedidos/admin/estatisticas - Estatísticas gerais

module.exports = router
