// src/backend/authMiddleware.js
const jwt = require('jsonwebtoken');

// Clave secreta (idealmente almacenada en .env)
const SECRET_KEY = process.env.JWT_SECRET || 'mi_clave_secreta';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }

    req.user = user;
    next();
  });
}

module.exports = verifyToken;
