const enderecoService = require('./endereco.services.js')

// Criar novo endereço
const createEndereco = async (req, res) => {
    try {
        const { logradouro, numero, bairro, cidade, estado, cep, complemento } = req.body
        const userId = req.user.userId // Vem do middleware de autenticação

        // Validação básica
        if (!logradouro || !numero || !bairro || !cidade || !estado || !cep) {
            return res.status(400).json({
                message: 'Campos obrigatórios: logradouro, numero, bairro, cidade, estado, cep'
            })
        }

        // Validação de CEP (formato básico)
        const cepRegex = /^\d{5}-?\d{3}$/
        if (!cepRegex.test(cep)) {
            return res.status(400).json({
                message: 'CEP deve estar no formato 00000-000'
            })
        }

        // Validação de estado (sigla de 2 letras)
        if (estado.length !== 2) {
            return res.status(400).json({
                message: 'Estado deve ser a sigla de 2 letras (ex: SP, RJ)'
            })
        }

        const endereco = await enderecoService.createEndereco({
            logradouro,
            numero,
            bairro,
            cidade,
            estado: estado.toUpperCase(),
            cep: cep.replace(/\D/g, ''), // Remove caracteres não numéricos
            complemento: complemento || null,
            userId
        })
        
        res.status(201).json({
            message: 'Endereço criado com sucesso',
            data: endereco
        })
    } catch (error) {
        console.error('Erro ao criar endereço:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar endereços do usuário logado
const getEnderecos = async (req, res) => {
    try {
        const userId = req.user.userId
        
        const enderecos = await enderecoService.getEnderecosByUser(userId)
        
        res.status(200).json({
            message: 'Endereços encontrados',
            data: enderecos,
            count: enderecos.length
        })
    } catch (error) {
        console.error('Erro ao buscar endereços:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar endereço por ID
const getEnderecoById = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.userId

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido'
            })
        }

        const endereco = await enderecoService.getEnderecoById(id, userId)
        
        res.status(200).json({
            message: 'Endereço encontrado',
            data: endereco
        })
    } catch (error) {
        console.error('Erro ao buscar endereço:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Endereço não encontrado'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Atualizar endereço
const updateEndereco = async (req, res) => {
    try {
        const { id } = req.params
        const { logradouro, numero, bairro, cidade, estado, cep, complemento } = req.body
        const userId = req.user.userId

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido'
            })
        }

        // Validação básica
        if (!logradouro || !numero || !bairro || !cidade || !estado || !cep) {
            return res.status(400).json({
                message: 'Campos obrigatórios: logradouro, numero, bairro, cidade, estado, cep'
            })
        }

        // Validação de CEP
        const cepRegex = /^\d{5}-?\d{3}$/
        if (!cepRegex.test(cep)) {
            return res.status(400).json({
                message: 'CEP deve estar no formato 00000-000'
            })
        }

        // Validação de estado
        if (estado.length !== 2) {
            return res.status(400).json({
                message: 'Estado deve ser a sigla de 2 letras (ex: SP, RJ)'
            })
        }

        const endereco = await enderecoService.updateEndereco(id, {
            logradouro,
            numero,
            bairro,
            cidade,
            estado: estado.toUpperCase(),
            cep: cep.replace(/\D/g, ''),
            complemento: complemento || null
        }, userId)
        
        res.status(200).json({
            message: 'Endereço atualizado com sucesso',
            data: endereco
        })
    } catch (error) {
        console.error('Erro ao atualizar endereço:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Endereço não encontrado'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Excluir endereço
const deleteEndereco = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.userId

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido'
            })
        }

        const result = await enderecoService.deleteEndereco(id, userId)
        
        res.status(200).json({
            message: result.message,
            data: result.endereco
        })
    } catch (error) {
        console.error('Erro ao excluir endereço:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Endereço não encontrado'
            })
        }
        
        if (error.message.includes('sendo usado em pedidos')) {
            return res.status(409).json({
                message: 'Não é possível excluir endereço que está sendo usado em pedidos'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar todos os endereços (admin)
const getAllEnderecos = async (req, res) => {
    try {
        const enderecos = await enderecoService.getAllEnderecos()
        
        res.status(200).json({
            message: 'Endereços encontrados',
            data: enderecos,
            count: enderecos.length
        })
    } catch (error) {
        console.error('Erro ao buscar endereços:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

module.exports = {
    createEndereco,
    getEnderecos,
    getEnderecoById,
    updateEndereco,
    deleteEndereco,
    getAllEnderecos
}
