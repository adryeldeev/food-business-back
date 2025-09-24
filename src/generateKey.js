const crypto = require('crypto');

// Gera uma chave JWT segura de 32 bytes e converte para base64
const generateJWTSecret = () => {
    return crypto.randomBytes(32).toString('base64');
};



module.exports = generateJWTSecret;
