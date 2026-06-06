const jwt = require('jsonwebtoken');

/**
 * Gerar token JWT
 * @param {Object} user - Objeto do utilizador
 * @returns {String} Token JWT
 */
exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

/**
 * Verificar token JWT
 * @param {String} token - Token JWT
 * @returns {Object} Payload do token
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Decodificar token (sem verificar)
 * @param {String} token - Token JWT
 * @returns {Object} Payload decodificado
 */
exports.decodeToken = (token) => {
  return jwt.decode(token);
};