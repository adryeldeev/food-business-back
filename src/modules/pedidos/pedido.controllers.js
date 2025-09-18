const pedidoService = require('./pedido.services.js')

// Criar novo pedido
const createPedido = async (req, res) => {
    try {
        const { enderecoId, itens, formaPagamento } = req.body
        const userId = req.user.userId

        // Validação básica
        if (!enderecoId || !itens || !formaPagamento) {
            return res.status(400).json({
                message: 'Campos obrigatórios: enderecoId, itens, formaPagamento'
            })
        }

        // Validação de itens
        if (!Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({
                message: 'Itens deve ser um array não vazio'
            })
        }

        // Validação de cada item
        for (const item of itens) {
            if (!item.foodItemId || !item.quantidade) {
                return res.status(400).json({
                    message: 'Cada item deve ter foodItemId e quantidade'
                })
            }

            if (item.quantidade <= 0) {
                return res.status(400).json({
                    message: 'Quantidade deve ser maior que zero'
                })
            }
        }

        // Validação de forma de pagamento
        const formasValidas = ['DINHEIRO', 'CARTAO', 'PIX', 'VALE']
        if (!formasValidas.includes(formaPagamento)) {
            return res.status(400).json({
                message: 'Forma de pagamento inválida'
            })
        }

        const pedido = await pedidoService.createPedido({
            userId,
            enderecoId,
            itens,
            formaPagamento
        })
        
        res.status(201).json({
            message: 'Pedido criado com sucesso',
            data: pedido
        })
    } catch (error) {
        console.error('Erro ao criar pedido:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: error.message
            })
        }
        
        if (error.message.includes('não pertence ao usuário')) {
            return res.status(403).json({
                message: 'Endereço não pertence ao usuário'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar pedidos do usuário
const getPedidos = async (req, res) => {
    try {
        const userId = req.user.userId
        const { status, dataInicio, dataFim } = req.query
        
        const filtros = {}
        if (status) filtros.status = status
        if (dataInicio) filtros.dataInicio = dataInicio
        if (dataFim) filtros.dataFim = dataFim
        
        const pedidos = await pedidoService.getPedidosByUser(userId, filtros)
        
        res.status(200).json({
            message: 'Pedidos encontrados',
            data: pedidos,
            count: pedidos.length
        })
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar pedido por ID
const getPedidoById = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.userId

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido'
            })
        }

        const pedido = await pedidoService.getPedidoById(id, userId)
        
        res.status(200).json({
            message: 'Pedido encontrado',
            data: pedido
        })
    } catch (error) {
        console.error('Erro ao buscar pedido:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Pedido não encontrado'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar todos os pedidos (admin)
const getAllPedidos = async (req, res) => {
    try {
        const { status, userId, dataInicio, dataFim } = req.query
        
        const filtros = {}
        if (status) filtros.status = status
        if (userId) filtros.userId = userId
        if (dataInicio) filtros.dataInicio = dataInicio
        if (dataFim) filtros.dataFim = dataFim
        
        const pedidos = await pedidoService.getAllPedidos(filtros)
        
        res.status(200).json({
            message: 'Pedidos encontrados',
            data: pedidos,
            count: pedidos.length
        })
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Atualizar status do pedido
const updateStatusPedido = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        const userId = req.user.userId

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido'
            })
        }

        if (!status) {
            return res.status(400).json({
                message: 'Status é obrigatório'
            })
        }

        const pedido = await pedidoService.updateStatusPedido(id, status, userId)
        
        res.status(200).json({
            message: 'Status do pedido atualizado com sucesso',
            data: pedido
        })
    } catch (error) {
        console.error('Erro ao atualizar status:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Pedido não encontrado'
            })
        }
        
        if (error.message.includes('Status inválido')) {
            return res.status(400).json({
                message: 'Status inválido'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Cancelar pedido
const cancelarPedido = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.userId

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido'
            })
        }

        const pedido = await pedidoService.cancelarPedido(id, userId)
        
        res.status(200).json({
            message: 'Pedido cancelado com sucesso',
            data: pedido
        })
    } catch (error) {
        console.error('Erro ao cancelar pedido:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Pedido não encontrado'
            })
        }
        
        if (error.message.includes('não pode ser cancelado')) {
            return res.status(400).json({
                message: error.message
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar estatísticas de pedidos
const getEstatisticas = async (req, res) => {
    try {
        const userId = req.user.userId
        
        const estatisticas = await pedidoService.getEstatisticasPedidos(userId)
        
        res.status(200).json({
            message: 'Estatísticas encontradas',
            data: estatisticas
        })
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar estatísticas gerais (admin)
const getEstatisticasGerais = async (req, res) => {
    try {
        const estatisticas = await pedidoService.getEstatisticasPedidos()
        
        res.status(200).json({
            message: 'Estatísticas gerais encontradas',
            data: estatisticas
        })
    } catch (error) {
        console.error('Erro ao buscar estatísticas gerais:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

module.exports = {
    createPedido,
    getPedidos,
    getPedidoById,
    getAllPedidos,
    updateStatusPedido,
    cancelarPedido,
    getEstatisticas,
    getEstatisticasGerais
}
