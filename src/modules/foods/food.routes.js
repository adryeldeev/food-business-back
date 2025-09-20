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
router.get('/categories/:id', foodController.getCategoryById)      // GET /categories/:id - Buscar categoria por ID
router.post('/categories', foodController.createCategory)          // POST /categories - Criar categoria
router.put('/categories/:id', foodController.updateCategory)       // PUT /categories/:id - Atualizar categoria
router.delete('/categories/:id', foodController.deleteCategory)    // DELETE /categories/:id - Excluir categoria

module.exports = router