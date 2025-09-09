const foodController = require('./food.controllers.js')
const express = require('express')

const router = express.Router()

// Rotas para itens de comida
router.post('/foods', foodController.createFood)                    // POST /foods - Criar item de comida
router.get('/foods', foodController.getFoods)                      // GET /foods - Listar todos os itens
router.get('/foods/category', foodController.getFoodByCategory)    // GET /foods/category?categoriaId=1 - Buscar por categoria
router.get('/foods/:id', foodController.getFoodById)               // GET /foods/:id - Buscar por ID
router.put('/foods/:id', foodController.updateFood)                // PUT /foods/:id - Atualizar item
router.delete('/foods/:id', foodController.deleteFood)             // DELETE /foods/:id - Excluir item

// Rotas para categorias
router.get('/categories', foodController.getCategories)            // GET /categories - Listar categorias
router.post('/categories', foodController.createCategory)          // POST /categories - Criar categoria

module.exports = router