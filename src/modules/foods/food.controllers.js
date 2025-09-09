const foodService = require('./food.services.js')

// Criar um novo item de comida
const createFood = async (req, res) => {
    try {
        const data = req.body
        
        // Validação básica
        if (!data.nome || !data.preco || !data.categoriaId) {
            return res.status(400).json({
                message: 'Campos obrigatórios: nome, preco, categoriaId'
            })
        }

        const food = await foodService.create(data)
        res.status(201).json({
            message: 'Item de comida criado com sucesso',
            data: food
        })
    } catch (error) {
        console.error('Erro ao criar item de comida:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar todos os itens de comida
const getFoods = async (req, res) => {
    try {
        const foods = await foodService.getAll()
        res.status(200).json({
            message: 'Itens de comida encontrados',
            data: foods,
            count: foods.length
        })
    } catch (error) {
        console.error('Erro ao buscar itens de comida:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar item de comida por ID
const getFoodById = async (req, res) => {
    try {
        const { id } = req.params
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido'
            })
        }

        const food = await foodService.getById(id)
        res.status(200).json({
            message: 'Item de comida encontrado',
            data: food
        })
    } catch (error) {
        console.error('Erro ao buscar item de comida:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Item de comida não encontrado'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar itens de comida por categoria
const getFoodByCategory = async (req, res) => {
    try {
        const { categoriaId } = req.query
        
        if (!categoriaId) {
            return res.status(400).json({
                message: 'Parâmetro categoriaId é obrigatório'
            })
        }

        const foods = await foodService.getByCategory(categoriaId)
        res.status(200).json({
            message: 'Itens de comida encontrados por categoria',
            data: foods,
            count: foods.length
        })
    } catch (error) {
        console.error('Erro ao buscar itens por categoria:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Atualizar item de comida
const updateFood = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido'
            })
        }

        const food = await foodService.update(id, data)
        res.status(200).json({
            message: 'Item de comida atualizado com sucesso',
            data: food
        })
    } catch (error) {
        console.error('Erro ao atualizar item de comida:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Item de comida não encontrado'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Excluir item de comida
const deleteFood = async (req, res) => {
    try {
        const { id } = req.params
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido'
            })
        }

        const result = await foodService.exclude(id)
        res.status(200).json({
            message: result.message,
            data: result.foodItem
        })
    } catch (error) {
        console.error('Erro ao excluir item de comida:', error.message)
        
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                message: 'Item de comida não encontrado'
            })
        }
        
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Buscar todas as categorias
const getCategories = async (req, res) => {
    try {
        const categories = await foodService.getCategories()
        res.status(200).json({
            message: 'Categorias encontradas',
            data: categories,
            count: categories.length
        })
    } catch (error) {
        console.error('Erro ao buscar categorias:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

// Criar nova categoria
const createCategory = async (req, res) => {
    try {
        const { nome } = req.body
        
        if (!nome) {
            return res.status(400).json({
                message: 'Campo nome é obrigatório'
            })
        }

        const category = await foodService.createCategory({ nome })
        res.status(201).json({
            message: 'Categoria criada com sucesso',
            data: category
        })
    } catch (error) {
        console.error('Erro ao criar categoria:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
}

module.exports = {
    createFood,
    getFoods,
    getFoodById,
    getFoodByCategory,
    updateFood,
    deleteFood,
    getCategories,
    createCategory
}