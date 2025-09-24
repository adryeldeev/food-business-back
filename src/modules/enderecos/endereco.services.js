const { PrismaClient } = require('../../generated/prisma')

const prisma = new PrismaClient()

// Criar novo endereço
const createEndereco = async (data) => {
    try {
        const endereco = await prisma.endereco.create({
            data: {
                logradouro: data.logradouro,
                numero: data.numero,
                bairro: data.bairro,
                cidade: data.cidade,
                estado: data.estado,
                cep: data.cep,
                complemento: data.complemento,
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

        return endereco
    } catch (error) {
        throw new Error(`Erro ao criar endereço: ${error.message}`)
        console.log('erro ao criar endereço' ,  error)
    }
}

// Buscar endereços do usuário
const getEnderecosByUser = async (userId) => {
    try {
        const enderecos = await prisma.endereco.findMany({
            where: { userId: parseInt(userId) },
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
                id: 'desc'
            }
        })

        return enderecos
    } catch (error) {
        throw new Error(`Erro ao buscar endereços: ${error.message}`)
    }
}

// Buscar endereço por ID
const getEnderecoById = async (id, userId) => {
    try {
        const endereco = await prisma.endereco.findFirst({
            where: {
                id: parseInt(id),
                userId: parseInt(userId)
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

        if (!endereco) {
            throw new Error('Endereço não encontrado')
        }

        return endereco
    } catch (error) {
        throw new Error(`Erro ao buscar endereço: ${error.message}`)
    }
}

// Atualizar endereço
const updateEndereco = async (id, data, userId) => {
    try {
        // Verificar se o endereço pertence ao usuário
        const enderecoExistente = await prisma.endereco.findFirst({
            where: {
                id: parseInt(id),
                userId: parseInt(userId)
            }
        })

        if (!enderecoExistente) {
            throw new Error('Endereço não encontrado')
        }

        const endereco = await prisma.endereco.update({
            where: { id: parseInt(id) },
            data: {
                logradouro: data.logradouro,
                numero: data.numero,
                bairro: data.bairro,
                cidade: data.cidade,
                estado: data.estado,
                cep: data.cep,
                complemento: data.complemento
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

        return endereco
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error('Endereço não encontrado')
        }
        throw new Error(`Erro ao atualizar endereço: ${error.message}`)
    }
}

// Excluir endereço
const deleteEndereco = async (id, userId) => {
    try {
        // Verificar se o endereço pertence ao usuário
        const enderecoExistente = await prisma.endereco.findFirst({
            where: {
                id: parseInt(id),
                userId: parseInt(userId)
            }
        })

        if (!enderecoExistente) {
            throw new Error('Endereço não encontrado')
        }

        // Verificar se o endereço está sendo usado em pedidos
        const pedidosComEndereco = await prisma.pedido.findFirst({
            where: { enderecoId: parseInt(id) }
        })

        if (pedidosComEndereco) {
            throw new Error('Não é possível excluir endereço que está sendo usado em pedidos')
        }

        const endereco = await prisma.endereco.delete({
            where: { id: parseInt(id) }
        })

        return { message: 'Endereço excluído com sucesso', endereco }
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error('Endereço não encontrado')
        }
        throw new Error(`Erro ao excluir endereço: ${error.message}`)
    }
}

// Buscar todos os endereços (admin)
const getAllEnderecos = async () => {
    try {
        const enderecos = await prisma.endereco.findMany({
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
                id: 'desc'
            }
        })

        return enderecos
    } catch (error) {
        throw new Error(`Erro ao buscar endereços: ${error.message}`)
    }
}

module.exports = {
    createEndereco,
    getEnderecosByUser,
    getEnderecoById,
    updateEndereco,
    deleteEndereco,
    getAllEnderecos
}
