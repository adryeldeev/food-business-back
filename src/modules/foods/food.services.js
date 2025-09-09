const { PrismaClient } = require('../../generated/prisma')

const prisma = new PrismaClient()

// Criar um novo item de comida
const create = async (data) => {
    try {
        const foodItem = await prisma.foodItem.create({
            data: {
                nome: data.nome,
                descricao: data.descricao,
                preco: data.preco,
                categoriaId: data.categoriaId
            },
            include: {
                categoria: true
            }
        })
        return foodItem
    } catch (error) {
        throw new Error(`Erro ao criar item de comida: ${error.message}`)
    }
}

// Buscar todos os itens de comida
const getAll = async () => {
    try {
        const foodItems = await prisma.foodItem.findMany({
            include: {
                categoria: true
            },
            orderBy: {
                nome: 'asc'
            }
        })
        return foodItems
    } catch (error) {
        throw new Error(`Erro ao buscar itens de comida: ${error.message}`)
    }
}

// Buscar item de comida por ID
const getById = async (id) => {
    try {
        const foodItem = await prisma.foodItem.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                categoria: true
            }
        })
        
        if (!foodItem) {
            throw new Error('Item de comida não encontrado')
        }
        
        return foodItem
    } catch (error) {
        throw new Error(`Erro ao buscar item de comida: ${error.message}`)
    }
}

// Buscar itens de comida por categoria
const getByCategory = async (categoriaId) => {
    try {
        const foodItems = await prisma.foodItem.findMany({
            where: {
                categoriaId: parseInt(categoriaId)
            },
            include: {
                categoria: true
            },
            orderBy: {
                nome: 'asc'
            }
        })
        return foodItems
    } catch (error) {
        throw new Error(`Erro ao buscar itens por categoria: ${error.message}`)
    }
}

// Atualizar item de comida
const update = async (id, data) => {
    try {
        const foodItem = await prisma.foodItem.update({
            where: {
                id: parseInt(id)
            },
            data: {
                nome: data.nome,
                descricao: data.descricao,
                preco: data.preco,
                categoriaId: data.categoriaId
            },
            include: {
                categoria: true
            }
        })
        return foodItem
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error('Item de comida não encontrado')
        }
        throw new Error(`Erro ao atualizar item de comida: ${error.message}`)
    }
}

// Excluir item de comida
const exclude = async (id) => {
    try {
        const foodItem = await prisma.foodItem.delete({
            where: {
                id: parseInt(id)
            }
        })
        return { message: 'Item de comida excluído com sucesso', foodItem }
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error('Item de comida não encontrado')
        }
        throw new Error(`Erro ao excluir item de comida: ${error.message}`)
    }
}

// Buscar todas as categorias
const getCategories = async () => {
    try {
        const categorias = await prisma.categoria.findMany({
            include: {
                foodItems: true
            },
            orderBy: {
                nome: 'asc'
            }
        })
        return categorias
    } catch (error) {
        throw new Error(`Erro ao buscar categorias: ${error.message}`)
    }
}

// Criar nova categoria
const createCategory = async (data) => {
    try {
        const categoria = await prisma.categoria.create({
            data: {
                nome: data.nome
            }
        })
        return categoria
    } catch (error) {
        throw new Error(`Erro ao criar categoria: ${error.message}`)
    }
}

module.exports = {
    create,
    getAll,
    getById,
    getByCategory,
    update,
    exclude,
    getCategories,
    createCategory
}
