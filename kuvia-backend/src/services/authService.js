const { User, Client, Seller } = require('../models');
const { generateToken } = require('../utils/jwt');
const { comparePassword } = require('../utils/password');

/**
 * Registar novo cliente
 * @param {Object} userData - Dados do utilizador
 * @returns {Object} Token e dados do utilizador
 */
exports.registerClient = async (userData) => {
  const { name, email, phone, password } = userData;

  // Verificar se email já existe
  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    throw new Error('Este email já está em uso');
  }

  // Verificar se telefone já existe
  const existingPhone = await User.findOne({ where: { phone } });
  if (existingPhone) {
    throw new Error('Este telefone já está em uso');
  }

  // Criar utilizador
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'CLIENT'
  });

  // Criar perfil de cliente
  const client = await Client.create({
    userId: user.id
  });

  // Gerar token
  const token = generateToken(user);

  return {
    token,
    user: user.toPublicJSON()
  };
};

/**
 * Registar novo vendedor
 * @param {Object} userData - Dados do utilizador
 * @param {Object} sellerData - Dados do vendedor
 * @returns {Object} Token e dados do utilizador
 */
exports.registerSeller = async (userData, sellerData = {}) => {
  const { name, email, phone, password } = userData;

  // Verificar se email já existe
  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    throw new Error('Este email já está em uso');
  }

  // Verificar se telefone já existe
  const existingPhone = await User.findOne({ where: { phone } });
  if (existingPhone) {
    throw new Error('Este telefone já está em uso');
  }

  // Criar utilizador
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'SELLER'
  });

  // Criar perfil de vendedor
  const seller = await Seller.create({
    userId: user.id,
    businessName: sellerData.businessName || null,
    businessType: sellerData.businessType || null,
    businessDescription: sellerData.businessDescription || null,
    whatsapp: sellerData.whatsapp || phone
  });

  // Gerar token
  const token = generateToken(user);

  return {
    token,
    user: user.toPublicJSON()
  };
};

/**
 * Login de utilizador
 * @param {String} identifier - Email ou telefone
 * @param {String} password - Senha
 * @returns {Object} Token e dados do utilizador
 */
exports.login = async (identifier, password) => {
  // Encontrar utilizador por email ou telefone
  const user = await User.findOne({
    where: {
      [require('sequelize').Op.or]: [
        { email: identifier },
        { phone: identifier }
      ]
    }
  });

  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  // Verificar se está ativo
  if (!user.isActive) {
    throw new Error('Conta desativada. Contacte o suporte.');
  }

  // Verificar senha
  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new Error('Credenciais inválidas');
  }

  // Atualizar último login
  await user.update({ lastLogin: new Date() });

  // Gerar token
  const token = generateToken(user);

  return {
    token,
    user: user.toPublicJSON()
  };
};

/**
 * Obter utilizador atual
 * @param {String} userId - ID do utilizador
 * @returns {Object} Dados do utilizador
 */
exports.getCurrentUser = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Client,
        as: 'clientData',
        attributes: ['id', 'address', 'city', 'province']
      },
      {
        model: Seller,
        as: 'sellerData',
        attributes: ['id', 'businessName', 'businessType', 'isVerified']
      }
    ]
  });

  if (!user) {
    throw new Error('Utilizador não encontrado');
  }

  return user.toPublicJSON();
};

/**
 * Atualizar perfil do utilizador
 * @param {String} userId - ID do utilizador
 * @param {Object} updateData - Dados a atualizar
 * @returns {Object} Dados atualizados
 */
exports.updateProfile = async (userId, updateData) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('Utilizador não encontrado');
  }

  // Se está a atualizar email, verificar se já existe
  if (updateData.email && updateData.email !== user.email) {
    const existingEmail = await User.findOne({ where: { email: updateData.email } });
    if (existingEmail) {
      throw new Error('Este email já está em uso');
    }
  }

  // Se está a atualizar telefone, verificar se já existe
  if (updateData.phone && updateData.phone !== user.phone) {
    const existingPhone = await User.findOne({ where: { phone: updateData.phone } });
    if (existingPhone) {
      throw new Error('Este telefone já está em uso');
    }
  }

  // Atualizar utilizador
  await user.update(updateData);

  return user.toPublicJSON();
};

/**
 * Alterar senha
 * @param {String} userId - ID do utilizador
 * @param {String} currentPassword - Senha atual
 * @param {String} newPassword - Nova senha
 * @returns {Boolean} True se alterou com sucesso
 */
exports.changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('Utilizador não encontrado');
  }

  // Verificar senha atual
  const isValidPassword = await comparePassword(currentPassword, user.password);
  if (!isValidPassword) {
    throw new Error('Senha atual incorreta');
  }

  // Atualizar senha (o hook beforeUpdate vai encriptar automaticamente)
  await user.update({ password: newPassword });

  return true;
};