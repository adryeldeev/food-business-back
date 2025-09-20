const { PrismaClient } = require('../../generated/prisma')

const prisma = new PrismaClient()

// Criar perfil de entregador
const createEntregador = async (data) => {
    try {
        // Verificar se o usuário já é entregador
        const entregadorExistente = await prisma.entregador.findUnique({
            where: { userId: data.userId }
        })

        if (entregadorExistente) {
            throw new Error('Usuário já é entregador')
        }

        // Verificar se CPF já está em uso
        const cpfExistente = await prisma.entregador.findFirst({
            where: { cpf: data.cpf }
        })

        if (cpfExistente) {
            throw new Error('CPF já está em uso')
        }

        const entregador = await prisma.entregador.create({
            data: {
                telefone: data.telefone,
                cpf: data.cpf,
                veiculo: data.veiculo,
                placa: data.placa,
                userId: data.userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                }
            }
        })

        return entregador
    } catch (error) {
        throw new Error(`Erro ao criar entregador: ${error.message}`)
    }
}

// Buscar entregador por ID do usuário
const getEntregadorByUserId = async (userId) => {
    try {
        const entregador = await prisma.entregador.findUnique({
            where: { userId: parseInt(userId) },
            include: {
                user: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                }
            }
        })

        if (!entregador) {
            throw new Error('Entregador não encontrado')
        }

        return entregador
    } catch (error) {
        throw new Error(`Erro ao buscar entregador: ${error.message}`)
    }
}

// Buscar entregador por ID
const getEntregadorById = async (id) => {
    try {
        const entregador = await prisma.entregador.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                }
            }
        })

        if (!entregador) {
            throw new Error('Entregador não encontrado')
        }

        return entregador
    } catch (error) {
        throw new Error(`Erro ao buscar entregador: ${error.message}`)
    }
}

// Buscar todos os entregadores
const getAllEntregadores = async () => {
    try {
        const entregadores = await prisma.entregador.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return entregadores
    } catch (error) {
        throw new Error(`Erro ao buscar entregadores: ${error.message}`)
    }
}

// Atualizar entregador
const updateEntregador = async (id, data, userId) => {
    try {
        // Verificar se o entregador pertence ao usuário
        const entregadorExistente = await prisma.entregador.findFirst({
            where: {
                id: parseInt(id),
                userId: parseInt(userId)
            }
        })

        if (!entregadorExistente) {
            throw new Error('Entregador não encontrado')
        }

        // Verificar se CPF já está em uso por outro entregador
        if (data.cpf) {
            const cpfExistente = await prisma.entregador.findFirst({
                where: {
                    cpf: data.cpf,
                    id: { not: parseInt(id) }
                }
            })

            if (cpfExistente) {
                throw new Error('CPF já está em uso por outro entregador')
            }
        }

        const entregador = await prisma.entregador.update({
            where: { id: parseInt(id) },
            data: {
                telefone: data.telefone,
                cpf: data.cpf,
                veiculo: data.veiculo,
                placa: data.placa
            },
            include: {
                user: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                }
            }
        })

        return entregador
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error('Entregador não encontrado')
        }
        throw new Error(`Erro ao atualizar entregador: ${error.message}`)
    }
}

// Excluir entregador
const deleteEntregador = async (id, userId) => {
    try {
        // Verificar se o entregador pertence ao usuário
        const entregadorExistente = await prisma.entregador.findFirst({
            where: {
                id: parseInt(id),
                userId: parseInt(userId)
            }
        })

        if (!entregadorExistente) {
            throw new Error('Entregador não encontrado')
        }

        const entregador = await prisma.entregador.delete({
            where: { id: parseInt(id) }
        })

        return { message: 'Entregador excluído com sucesso', entregador }
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error('Entregador não encontrado')
        }
        throw new Error(`Erro ao excluir entregador: ${error.message}`)
    }
}

// Verificar se usuário é entregador
const isEntregador = async (userId) => {
    try {
        const entregador = await prisma.entregador.findUnique({
            where: { userId: parseInt(userId) }
        })

        return !!entregador
    } catch (error) {
        throw new Error(`Erro ao verificar entregador: ${error.message}`)
    }
}

module.exports = {
    createEntregador,
    getEntregadorByUserId,
    getEntregadorById,
    getAllEntregadores,
    updateEntregador,
    deleteEntregador,
    isEntregador
}
