const jwt = require('jsonwebtoken')

// Middleware de autenticação JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Token de acesso necessário' })
    }

    jwt.verify(token, process.env.JWT_SECRET || 'seu_jwt_secret_aqui', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' })
        }
        req.user = user
        next()
    })
}

module.exports = {
    authenticateToken
}