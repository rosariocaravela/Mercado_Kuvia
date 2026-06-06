const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');
const response = require('../utils/response');

/**
 * Middleware para verificar token JWT
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Obter token do header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.unauthorized(res, 'Token não fornecido');
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar token
    const decoded = verifyToken(token);
    if (!decoded) {
      return response.unauthorized(res, 'Token inválido ou expirado');
    }

    // Buscar utilizador
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return response.unauthorized(res, 'Utilizador não encontrado');
    }

    // Verificar se está ativo
    if (!user.isActive) {
      return response.unauthorized(res, 'Conta desativada');
    }

    // Adicionar utilizador ao request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return response.unauthorized(res, 'Erro ao autenticar');
  }
};

/**
 * Middleware para verificar role
 * @param {Array} roles - Roles permitidos
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return response.unauthorized(res, 'Não autenticado');
    }

    if (!roles.includes(req.user.role)) {
      return response.error(res, 'Não tem permissão para aceder a este recurso', 403);
    }

    next();
  };
};