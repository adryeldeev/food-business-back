const foodService = require('./food.services.js')

const createFood = async (req, res) => {
    try{
        data = req.body
        food = await foodService.create(data)

        res.status(201).json(food)
    }catch(error){
        res.status(500).json({message:'internal server error'})
    }
}

const getFoods = async (req, res) => {
    try{
        foods = await foodService.getAll()

        res.status(201).json(foods)
    }catch(error){
        res.status(500).json({message:'internal server error'})
    }
}

const getFoodById = async (req, res) => {
    try{
        id = req.params.id
        food = await foodService.getById(id)

        res.status(201).json(food)
    }catch(error){
        res.status(500).json({message:'internal server error'})
    }
}

const getFoodByCategory = async (req, res) => {
    try{
        const { category } = req.query
        food = await foodService.getByCategory(category)

        res.status(201).json(food)
    }catch(error){
        res.status(500).json({message:'internal server error'})
    }
}

const updateFood = async (req, res) => {
    try{
        data = req.body
        id = req.params.id
        food = await foodService.update(id, data)

        res.status(201).json(food)
    }catch(error){
        res.status(500).json({message:'internal server error'})
    }
}

const deleteFood = async (req, res) => {
    try{
        id = req.params.id
        food = await foodService.exclude(id)

        res.status(201).json(food)
    }catch(error){
        res.status(500).json({message:'internal server error'})
    }
}

module.exports = {
    createFood,
    getFoods,
    getFoodById,
    getFoodByCategory,
    updateFood,
    deleteFood
}