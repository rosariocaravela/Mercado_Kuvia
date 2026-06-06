const authService = require('../services/authService');
const response = require('../utils/response');

/**
 * Registar cliente
 * POST /api/auth/register/client
 */
exports.registerClient = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validação básica
    if (!name || !email || !phone || !password) {
      return response.error(res, 'Todos os campos são obrigatórios', 400);
    }

    const result = await authService.registerClient({
      name,
      email,
      phone,
      password
    });

    return response.success(res, result, 'Cliente registado com sucesso', 201);
  } catch (error) {
    console.error('Erro ao registar cliente:', error);
    return response.error(res, error.message, 400);
  }
};

/**
 * Registar vendedor
 * POST /api/auth/register/seller
 */
exports.registerSeller = async (req, res) => {
  try {
    const { name, email, phone, password, businessName, businessType, businessDescription } = req.body;

    // Validação básica
    if (!name || !email || !phone || !password) {
      return response.error(res, 'Nome, email, telefone e senha são obrigatórios', 400);
    }

    const result = await authService.registerSeller(
      { name, email, phone, password },
      { businessName, businessType, businessDescription }
    );

    return response.success(res, result, 'Vendedor registado com sucesso', 201);
  } catch (error) {
    console.error('Erro ao registar vendedor:', error);
    return response.error(res, error.message, 400);
  }
};

/**
 * Login
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Validação básica
    if (!identifier || !password) {
      return response.error(res, 'Email/telefone e senha são obrigatórios', 400);
    }

    const result = await authService.login(identifier, password);

    return response.success(res, result, 'Login realizado com sucesso');
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return response.error(res, error.message, 401);
  }
};

/**
 * Obter utilizador atual
 * GET /api/auth/me
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await authService.getCurrentUser(userId);

    return response.success(res, { user }, 'Dados do utilizador obtidos com sucesso');
  } catch (error) {
    console.error('Erro ao obter utilizador:', error);
    return response.error(res, error.message, 404);
  }
};

/**
 * Atualizar perfil
 * PUT /api/auth/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const user = await authService.updateProfile(userId, updateData);

    return response.success(res, { user }, 'Perfil atualizado com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return response.error(res, error.message, 400);
  }
};

/**
 * Alterar senha
 * POST /api/auth/change-password
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return response.error(res, 'Senha atual e nova senha são obrigatórias', 400);
    }

    if (newPassword.length < 6) {
      return response.error(res, 'A nova senha deve ter pelo menos 6 caracteres', 400);
    }

    await authService.changePassword(userId, currentPassword, newPassword);

    return response.success(res, null, 'Senha alterada com sucesso');
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return response.error(res, error.message, 400);
  }
};