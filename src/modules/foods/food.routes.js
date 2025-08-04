const foodController = require('./food.controllers.js')
const express = require('express')

const router = express.Router()

router.post('/foods', foodController.createFood)
router.get('/foods', foodController.getFoods)
router.get('/foods/:id', foodController.getFoodById)
router.get('/foods', foodController.getFoodByCategory)
router.put('/foods/:id', foodController.updateFood)
router.delete('/foods/:id', foodController.deleteFood)

module.exports = router