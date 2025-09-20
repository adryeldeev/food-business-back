const { PrismaClient } = require('../../generated/prisma')

const prisma = new PrismaClient()

// Criar novo pedido
const createPedido = async (data) => {
    try {
        const { userId, enderecoId, itens, formaPagamento } = data

        // Verificar se o endereço pertence ao usuário
        const endereco = await prisma.endereco.findFirst({
            where: {
                id: parseInt(enderecoId),
                userId: parseInt(userId)
            }
        })

        if (!endereco) {
            throw new Error('Endereço não encontrado ou não pertence ao usuário')
        }

        // Verificar se os itens existem e calcular valor total
        let valorTotal = 0
        const itensValidados = []

        for (const item of itens) {
            const foodItem = await prisma.foodItem.findUnique({
                where: { id: parseInt(item.foodItemId) }
            })

            if (!foodItem) {
                throw new Error(`Item de comida não encontrado: ID ${item.foodItemId}`)
            }

            if (item.quantidade <= 0) {
                throw new Error(`Quantidade inválida para o item: ${foodItem.nome}`)
            }

            const precoItem = foodItem.preco * item.quantidade
            valorTotal += precoItem

            itensValidados.push({
                foodItemId: parseInt(item.foodItemId),
                quantidade: parseInt(item.quantidade),
                preco: foodItem.preco
            })
        }

        if (valorTotal <= 0) {
            throw new Error('Valor total do pedido deve ser maior que zero')
        }

        // Criar pedido com itens em uma transação
        const pedido = await prisma.$transaction(async (tx) => {
            // Criar o pedido
            const novoPedido = await tx.pedido.create({
                data: {
                    userId: parseInt(userId),
                    enderecoId: parseInt(enderecoId),
                    status: 'PENDENTE',
                    formaPagamento: formaPagamento,
                    valorTotal: valorTotal
                }
            })

            // Criar os itens do pedido
            const itensCriados = await Promise.all(
                itensValidados.map(item => 
                    tx.itensPedido.create({
                        data: {
                            pedidoId: novoPedido.id,
                            foodItemId: item.foodItemId,
                            quantidade: item.quantidade,
                            preco: item.preco
                        }
                    })
                )
            )

            // Buscar o pedido completo com relacionamentos
            return await tx.pedido.findUnique({
                where: { id: novoPedido.id },
                include: {
                    user: {
                        select: {
                            id: true,
                            nome: true,
                            email: true
                        }
                    },
                    endereco: true,
                    itens: {
                        include: {
                            foodItem: {
                                include: {
                                    categoria: true
                                }
                            }
                        }
                    }
                }
            })
        })

        return pedido
    } catch (error) {
        throw new Error(`Erro ao criar pedido: ${error.message}`)
    }
}

// Buscar pedidos do usuário
const getPedidosByUser = async (userId, filtros = {}) => {
    try {
        const where = {
            userId: parseInt(userId)
        }

        // Aplicar filtros
        if (filtros.status) {
            where.status = filtros.status
        }

        if (filtros.dataInicio && filtros.dataFim) {
            where.createdAt = {
                gte: new Date(filtros.dataInicio),
                lte: new Date(filtros.dataFim)
            }
        }

        const pedidos = await prisma.pedido.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                endereco: true,
                itens: {
                    include: {
                        foodItem: {
                            include: {
                                categoria: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return pedidos
    } catch (error) {
        throw new Error(`Erro ao buscar pedidos: ${error.message}`)
    }
}

// Buscar pedido por ID
const getPedidoById = async (id, userId) => {
    try {
        const pedido = await prisma.pedido.findFirst({
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
                },
                endereco: true,
                itens: {
                    include: {
                        foodItem: {
                            include: {
                                categoria: true
                            }
                        }
                    }
                }
            }
        })

        if (!pedido) {
            throw new Error('Pedido não encontrado')
        }

        return pedido
    } catch (error) {
        throw new Error(`Erro ao buscar pedido: ${error.message}`)
    }
}

// Buscar todos os pedidos (admin)
const getAllPedidos = async (filtros = {}) => {
    try {
        const where = {}

        // Aplicar filtros
        if (filtros.status) {
            where.status = filtros.status
        }

        if (filtros.userId) {
            where.userId = parseInt(filtros.userId)
        }

        if (filtros.dataInicio && filtros.dataFim) {
            where.createdAt = {
                gte: new Date(filtros.dataInicio),
                lte: new Date(filtros.dataFim)
            }
        }

        const pedidos = await prisma.pedido.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                endereco: true,
                itens: {
                    include: {
                        foodItem: {
                            include: {
                                categoria: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return pedidos
    } catch (error) {
        throw new Error(`Erro ao buscar pedidos: ${error.message}`)
    }
}

// Atualizar status do pedido
const updateStatusPedido = async (id, status, userId = null) => {
    try {
        const where = { id: parseInt(id) }
        
        // Se userId for fornecido, verificar se o pedido pertence ao usuário
        if (userId) {
            where.userId = parseInt(userId)
        }

        const pedido = await prisma.pedido.findFirst({ where })

        if (!pedido) {
            throw new Error('Pedido não encontrado')
        }

        // Validar status
        const statusValidos = ['PENDENTE', 'CONFIRMADO', 'EM_PREPARO', 'A_CAMINHO', 'ENTREGUE', 'CANCELADO']
        if (!statusValidos.includes(status)) {
            throw new Error('Status inválido')
        }

        const pedidoAtualizado = await prisma.pedido.update({
            where: { id: parseInt(id) },
            data: { status },
            include: {
                user: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                endereco: true,
                itens: {
                    include: {
                        foodItem: {
                            include: {
                                categoria: true
                            }
                        }
                    }
                }
            }
        })

        return pedidoAtualizado
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error('Pedido não encontrado')
        }
        throw new Error(`Erro ao atualizar status do pedido: ${error.message}`)
    }
}

// Cancelar pedido
const cancelarPedido = async (id, userId) => {
    try {
        const pedido = await prisma.pedido.findFirst({
            where: {
                id: parseInt(id),
                userId: parseInt(userId)
            }
        })

        if (!pedido) {
            throw new Error('Pedido não encontrado')
        }

        // Só pode cancelar pedidos pendentes ou confirmados
        if (!['PENDENTE', 'CONFIRMADO'].includes(pedido.status)) {
            throw new Error('Pedido não pode ser cancelado neste status')
        }

        const pedidoCancelado = await prisma.pedido.update({
            where: { id: parseInt(id) },
            data: { status: 'CANCELADO' },
            include: {
                user: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                endereco: true,
                itens: {
                    include: {
                        foodItem: {
                            include: {
                                categoria: true
                            }
                        }
                    }
                }
            }
        })

        return pedidoCancelado
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error('Pedido não encontrado')
        }
        throw new Error(`Erro ao cancelar pedido: ${error.message}`)
    }
}

// Buscar estatísticas de pedidos
const getEstatisticasPedidos = async (userId = null) => {
    try {
        const where = userId ? { userId: parseInt(userId) } : {}

        const [
            totalPedidos,
            pedidosPendentes,
            pedidosConfirmados,
            pedidosEntregues,
            valorTotalVendas
        ] = await Promise.all([
            prisma.pedido.count({ where }),
            prisma.pedido.count({ where: { ...where, status: 'PENDENTE' } }),
            prisma.pedido.count({ where: { ...where, status: 'CONFIRMADO' } }),
            prisma.pedido.count({ where: { ...where, status: 'ENTREGUE' } }),
            prisma.pedido.aggregate({
                where: { ...where, status: 'ENTREGUE' },
                _sum: { valorTotal: true }
            })
        ])

        return {
            totalPedidos,
            pedidosPendentes,
            pedidosConfirmados,
            pedidosEntregues,
            valorTotalVendas: valorTotalVendas._sum.valorTotal || 0
        }
    } catch (error) {
        throw new Error(`Erro ao buscar estatísticas: ${error.message}`)
    }
}

module.exports = {
    createPedido,
    getPedidosByUser,
    getPedidoById,
    getAllPedidos,
    updateStatusPedido,
    cancelarPedido,
    getEstatisticasPedidos
}
