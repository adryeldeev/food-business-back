require('dotenv').config({'path':`${process.cwd()}/.env`})

const express = require('express')
const userRoutes = require('./modules/users/user.routes.js')

const app = express()

const port = process.env.APP_PORT || 3000
app.use(express.json())
app.use('/food-business/api', userRoutes)

app.listen(port, () => {
    console.log(`Server up and running on port ${port}`)
})