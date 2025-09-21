const { authenticateToken } = require('../../middlewares/auth.js')
const foodController = require('./food.controllers.js')
const express = require('express')

const router = express.Router()

// Rotas para itens de comida
router.post('/foods', authenticateToken, foodController.createFood)                    // POST /foods - Criar item de comida
router.get('/foods', foodController.getFoods)                      // GET /foods - Listar todos os itens
router.get('/foods/category', foodController.getFoodByCategory)    // GET /foods/category?categoriaId=1 - Buscar por categoria
router.get('/foods/:id', foodController.getFoodById)               // GET /foods/:id - Buscar por ID
router.put('/foods/:id', authenticateToken, foodController.updateFood)                // PUT /foods/:id - Atualizar item
router.delete('/foods/:id', authenticateToken, foodController.deleteFood)             // DELETE /foods/:id - Excluir item

// Rotas para categorias
router.get('/categories', foodController.getCategories)            // GET /categories - Listar categorias
router.get('/categories/:id', foodController.getCategoryById)      // GET /categories/:id - Buscar categoria por ID
router.post('/categories', authenticateToken, foodController.createCategory)          // POST /categories - Criar categoria
router.put('/categories/:id', authenticateToken, foodController.updateCategory)       // PUT /categories/:id - Atualizar categoria
router.delete('/categories/:id',  authenticateToken, foodController.deleteCategory)    // DELETE /categories/:id - Excluir categoria

module.exports = router