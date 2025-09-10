const { PrismaClient } = require('../../generated/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

// Criar novo usuário
const createUser = async (data) => {
    try {
        // Verificar se email já existe
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if (existingUser) {
            throw new Error('Email já está em uso')
        }

        // Criptografar senha
        const hashedPassword = await bcrypt.hash(data.senha, 10)

        const user = await prisma.user.create({
            data: {
                nome: data.nome,
                email: data.email,
                senha: hashedPassword
            },
            select: {
                id: true,
                nome: true,
                email: true,
                createdAt: true
            }
        })

        return user
    } catch (error) {
        throw new Error(`Erro ao criar usuário: ${error.message}`)
    }
}

// Buscar todos os usuários
const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                createdAt: true,
                enderecos: true,
                pedidos: {
                    select: {
                        id: true,
                        status: true,
                        valorTotal: true,
                        createdAt: true
                    }
                }
            }
        })
        return users
    } catch (error) {
        throw new Error(`Erro ao buscar usuários: ${error.message}`)
    }
}

// Buscar usuário por ID
const getUserById = async (id) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                nome: true,
                email: true,
                createdAt: true,
                enderecos: true,
                pedidos: {
                    include: {
                        itens: {
                            include: {
                                foodItem: true
                            }
                        }
                    }
                },
                entregador: true
            }
        })

        if (!user) {
            throw new Error('Usuário não encontrado')
        }

        return user
    } catch (error) {
        throw new Error(`Erro ao buscar usuário: ${error.message}`)
    }
}

// Atualizar usuário
const updateUser = async (id, data) => {
    try {
        const updateData = {}
        
        if (data.nome) updateData.nome = data.nome
        if (data.email) updateData.email = data.email
        if (data.senha) {
            updateData.senha = await bcrypt.hash(data.senha, 10)
        }

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: updateData,
            select: {
                id: true,
                nome: true,
                email: true,
                updatedAt: true
            }
        })

        return user
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error('Usuário não encontrado')
        }
        throw new Error(`Erro ao atualizar usuário: ${error.message}`)
    }
}

// Excluir usuário
const deleteUser = async (id) => {
    try {
        const user = await prisma.user.delete({
            where: { id: parseInt(id) }
        })

        return { message: 'Usuário excluído com sucesso', user }
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error('Usuário não encontrado')
        }
        throw new Error(`Erro ao excluir usuário: ${error.message}`)
    }
}

// Login do usuário
const loginUser = async (email, senha) => {
    try {
        // Buscar usuário por email
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new Error('Email ou senha incorretos')
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(senha, user.senha)

        if (!isPasswordValid) {
            throw new Error('Email ou senha incorretos')
        }

        // Gerar JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email 
            },
            process.env.JWT_SECRET || 'seu_jwt_secret_aqui',
            { expiresIn: '24h' }
        )

        return {
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email
            },
            token
        }
    } catch (error) {
        throw new Error(`Erro ao fazer login: ${error.message}`)
    }
}

// Buscar perfil do usuário logado
const getProfile = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                nome: true,
                email: true,
                createdAt: true,
                enderecos: true,
                pedidos: {
                    include: {
                        itens: {
                            include: {
                                foodItem: true
                            }
                        }
                    }
                },
                entregador: true
            }
        })

        if (!user) {
            throw new Error('Usuário não encontrado')
        }

        return user
    } catch (error) {
        throw new Error(`Erro ao buscar perfil: ${error.message}`)
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    getProfile
}
