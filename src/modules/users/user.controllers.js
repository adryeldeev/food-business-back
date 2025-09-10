const userService = require('./user.services.js')

// Criar novo usuário
const createUser = async (req, res) => {
    try {
        const { nome, email, senha } = req.body

        // Validação básica
        if (!nome || !email || !senha) {
            return res.status(400).json({
                message: 'Campos obrigatórios: nome, email, senha'
            })
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Email inválido'
            })
        }

        // Validação de senha
        if (senha.length < 6) {
            return res.status(400).json({
                message: 'Senha deve ter pelo menos 6 caracteres'
            })
        }

        const user = await userService.createUser({ nome, email, senha })
        
        res.status(201).json({
            message: 'Usuário criado com sucesso',
            data: user
        })
    } catch (error) {
        console.error('Erro ao criar usuário:', error.message)
        
        if (error.message.includes('já está em uso')) {
            return res.status(409).json({
                message: 'Email já está em uso'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar todos os usuários
const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers()
        
        res.status(200).json({
            message: 'Usuários encontrados',
            data: users,
            count: users.length
        })
    } catch (error) {
        console.error('Erro ao buscar usuários:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar usuário por ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido'
            })
        }

        const user = await userService.getUserById(id)
        
        res.status(200).json({
            message: 'Usuário encontrado',
            data: user
        })
    } catch (error) {
        console.error('Erro ao buscar usuário:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Usuário não encontrado'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Atualizar usuário
const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { nome, email, senha } = req.body

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido'
            })
        }

        // Validação de email se fornecido
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: 'Email inválido'
                })
            }
        }

        // Validação de senha se fornecida
        if (senha && senha.length < 6) {
            return res.status(400).json({
                message: 'Senha deve ter pelo menos 6 caracteres'
            })
        }

        const user = await userService.updateUser(id, { nome, email, senha })
        
        res.status(200).json({
            message: 'Usuário atualizado com sucesso',
            data: user
        })
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Usuário não encontrado'
            })
        }
        
        if (error.message.includes('já está em uso')) {
            return res.status(409).json({
                message: 'Email já está em uso'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Excluir usuário
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido'
            })
        }

        const result = await userService.deleteUser(id)
        
        res.status(200).json({
            message: result.message,
            data: result.user
        })
    } catch (error) {
        console.error('Erro ao excluir usuário:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Usuário não encontrado'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Login do usuário
const loginUser = async (req, res) => {
    try {
        const { email, senha } = req.body

        if (!email || !senha) {
            return res.status(400).json({
                message: 'Email e senha são obrigatórios'
            })
        }

        const result = await userService.loginUser(email, senha)
        
        res.status(200).json({
            message: 'Login realizado com sucesso',
            data: result
        })
    } catch (error) {
        console.error('Erro ao fazer login:', error.message)
        
        if (error.message.includes('Email ou senha incorretos')) {
            return res.status(401).json({
                message: 'Email ou senha incorretos'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar perfil do usuário logado
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId // Vem do middleware de autenticação
        
        const user = await userService.getProfile(userId)
        
        res.status(200).json({
            message: 'Perfil encontrado',
            data: user
        })
    } catch (error) {
        console.error('Erro ao buscar perfil:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Usuário não encontrado'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    getProfile
}
