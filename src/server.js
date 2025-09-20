require('dotenv').config({'path':`${process.cwd()}/.env`})

const express = require('express')
const cors = require('cors')
const foodRoutes = require('./modules/foods/food.routes.js')
const userRoutes = require('./modules/users/user.routes.js')
const enderecoRoutes = require('./modules/enderecos/endereco.routes.js')
const entregadorRoutes = require('./modules/entregadores/entregador.routes.js')
const pedidoRoutes = require('./modules/pedidos/pedido.routes.js')

const app = express()

const port = process.env.APP_PORT || 3000
app.use(express.json())

app.use(cors({
    origin: 'http://localhost:5173', // <--- ESSA LINHA É CRUCIAL: PERMITE APENAS SEU FRONTEND LOCAL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // <--- Métodos HTTP que suas rotas usam
    allowedHeaders: ['Content-Type', 'Authorization'], // <--- Cabeçalhos que seu frontend vai enviar (inclua 'Authorization' para tokens)
    credentials: true // <--- Permite cookies e cabeçalhos de autorização se necessário (boa prática para autenticação)
  }));
// Rotas
app.use('/api/foods', foodRoutes)
app.use('/api/users', userRoutes)
app.use('/api/enderecos', enderecoRoutes)
app.use('/api/entregadores', entregadorRoutes)
app.use('/api/pedidos', pedidoRoutes)

app.listen(port, () => {
    console.log(`Server up and running on port ${port}`)
})