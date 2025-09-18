const entregadorService = require('./entregador.services.js')

// Criar perfil de entregador
const createEntregador = async (req, res) => {
    try {
        const { telefone, cpf, veiculo, placa } = req.body
        const userId = req.user.userId // Vem do middleware de autenticação

        // Validação básica
        if (!telefone || !cpf || !veiculo || !placa) {
            return res.status(400).json({
                message: 'Campos obrigatórios: telefone, cpf, veiculo, placa'
            })
        }

        // Validação de CPF (formato básico)
        const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/
        if (!cpfRegex.test(cpf)) {
            return res.status(400).json({
                message: 'CPF deve estar no formato 000.000.000-00'
            })
        }

        // Validação de telefone (formato básico)
        const telefoneRegex = /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/
        if (!telefoneRegex.test(telefone)) {
            return res.status(400).json({
                message: 'Telefone deve estar no formato (00) 00000-0000'
            })
        }

        // Validação de placa (formato básico)
        const placaRegex = /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/
        if (!placaRegex.test(placa)) {
            return res.status(400).json({
                message: 'Placa deve estar no formato ABC-1234 ou ABC1D23'
            })
        }

        const entregador = await entregadorService.createEntregador({
            telefone,
            cpf: cpf.replace(/\D/g, ''), // Remove caracteres não numéricos
            veiculo,
            placa: placa.toUpperCase(),
            userId
        })
        
        res.status(201).json({
            message: 'Perfil de entregador criado com sucesso',
            data: entregador
        })
    } catch (error) {
        console.error('Erro ao criar entregador:', error.message)
        
        if (error.message.includes('já é entregador')) {
            return res.status(409).json({
                message: 'Usuário já é entregador'
            })
        }
        
        if (error.message.includes('CPF já está em uso')) {
            return res.status(409).json({
                message: 'CPF já está em uso'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar perfil do entregador logado
const getMeuPerfil = async (req, res) => {
    try {
        const userId = req.user.userId
        
        const entregador = await entregadorService.getEntregadorByUserId(userId)
        
        res.status(200).json({
            message: 'Perfil encontrado',
            data: entregador
        })
    } catch (error) {
        console.error('Erro ao buscar perfil:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Usuário não é entregador'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar entregador por ID
const getEntregadorById = async (req, res) => {
    try {
        const { id } = req.params

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido'
            })
        }

        const entregador = await entregadorService.getEntregadorById(id)
        
        res.status(200).json({
            message: 'Entregador encontrado',
            data: entregador
        })
    } catch (error) {
        console.error('Erro ao buscar entregador:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Entregador não encontrado'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar todos os entregadores
const getEntregadores = async (req, res) => {
    try {
        const entregadores = await entregadorService.getAllEntregadores()
        
        res.status(200).json({
            message: 'Entregadores encontrados',
            data: entregadores,
            count: entregadores.length
        })
    } catch (error) {
        console.error('Erro ao buscar entregadores:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Atualizar perfil do entregador logado
const updateMeuPerfil = async (req, res) => {
    try {
        const { telefone, cpf, veiculo, placa } = req.body
        const userId = req.user.userId

        // Validação básica
        if (!telefone || !cpf || !veiculo || !placa) {
            return res.status(400).json({
                message: 'Campos obrigatórios: telefone, cpf, veiculo, placa'
            })
        }

        // Validação de CPF
        const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/
        if (!cpfRegex.test(cpf)) {
            return res.status(400).json({
                message: 'CPF deve estar no formato 000.000.000-00'
            })
        }

        // Validação de telefone
        const telefoneRegex = /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/
        if (!telefoneRegex.test(telefone)) {
            return res.status(400).json({
                message: 'Telefone deve estar no formato (00) 00000-0000'
            })
        }

        // Validação de placa
        const placaRegex = /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/
        if (!placaRegex.test(placa)) {
            return res.status(400).json({
                message: 'Placa deve estar no formato ABC-1234 ou ABC1D23'
            })
        }

        // Buscar ID do entregador pelo userId
        const entregadorExistente = await entregadorService.getEntregadorByUserId(userId)
        const entregadorId = entregadorExistente.id

        const entregador = await entregadorService.updateEntregador(entregadorId, {
            telefone,
            cpf: cpf.replace(/\D/g, ''),
            veiculo,
            placa: placa.toUpperCase()
        }, userId)
        
        res.status(200).json({
            message: 'Perfil atualizado com sucesso',
            data: entregador
        })
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Usuário não é entregador'
            })
        }
        
        if (error.message.includes('CPF já está em uso')) {
            return res.status(409).json({
                message: 'CPF já está em uso por outro entregador'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Excluir perfil de entregador
const deleteMeuPerfil = async (req, res) => {
    try {
        const userId = req.user.userId

        // Buscar ID do entregador pelo userId
        const entregadorExistente = await entregadorService.getEntregadorByUserId(userId)
        const entregadorId = entregadorExistente.id

        const result = await entregadorService.deleteEntregador(entregadorId, userId)
        
        res.status(200).json({
            message: result.message,
            data: result.entregador
        })
    } catch (error) {
        console.error('Erro ao excluir perfil:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Usuário não é entregador'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Verificar se usuário é entregador
const verificarEntregador = async (req, res) => {
    try {
        const userId = req.user.userId
        
        const isEntregador = await entregadorService.isEntregador(userId)
        
        res.status(200).json({
            message: 'Verificação realizada',
            data: { isEntregador }
        })
    } catch (error) {
        console.error('Erro ao verificar entregador:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

module.exports = {
    createEntregador,
    getMeuPerfil,
    getEntregadorById,
    getEntregadores,
    updateMeuPerfil,
    deleteMeuPerfil,
    verificarEntregador
}
