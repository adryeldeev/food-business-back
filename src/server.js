require('dotenv').config({'path':`${process.cwd()}/.env`})

const express = require('express')
const foodRoutes = require('./modules/foods/food.routes.js')

const app = express()

const port = process.env.APP_PORT || 3000
app.use(express.json())
app.use('/api', foodRoutes)

app.listen(port, () => {
    console.log(`Server up and running on port ${port}`)
})