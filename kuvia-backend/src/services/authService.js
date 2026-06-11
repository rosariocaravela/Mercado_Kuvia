const { User, Client, Seller } = require('../models');
const { generateToken } = require('../utils/jwt');
const { comparePassword } = require('../utils/password');

/**
 * REGISTAR CLIENTE
 */
exports.registerClient = async (userData) => {
  const { name, email, phone, password } = userData;

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) throw new Error('Este email já está em uso');

  const existingPhone = await User.findOne({ where: { phone } });
  if (existingPhone) throw new Error('Este telefone já está em uso');

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'CLIENT',
  });

  await Client.create({ userId: user.id });

  const token = generateToken(user);

  return {
    token,
    user: user.toPublicJSON(),
  };
};

/**
 * REGISTAR VENDEDOR
 */
exports.registerSeller = async (userData, sellerData = {}) => {
  const { name, email, phone, password } = userData;

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) throw new Error('Este email já está em uso');

  const existingPhone = await User.findOne({ where: { phone } });
  if (existingPhone) throw new Error('Este telefone já está em uso');

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'SELLER',
  });

  const validTypes = [
    'ELETRONICOS',
    'MODA',
    'BELEZA',
    'ALIMENTACAO',
    'AGRICULTURA',
    'MOVEIS',
    'SERVICOS',
    'OUTROS',
  ];

  const businessType = sellerData.businessType?.toUpperCase();

  if (businessType && !validTypes.includes(businessType)) {
    throw new Error(
      'Tipo de negócio inválido. Use: ELETRONICOS, MODA, BELEZA, ALIMENTACAO, AGRICULTURA, MOVEIS, SERVICOS, OUTROS'
    );
  }

  await Seller.create({
    userId: user.id,
    businessName: sellerData.businessName || null,
    businessType: businessType || null,
    businessDescription: sellerData.businessDescription || null,
    whatsapp: sellerData.whatsapp || phone,
  });

  const token = generateToken(user);

  return {
    token,
    user: user.toPublicJSON(),
  };
};

/**
 * LOGIN
 */
exports.login = async (identifier, password) => {
  const user = await User.findOne({
    where: {
      [require('sequelize').Op.or]: [
        { email: identifier },
        { phone: identifier },
      ],
    },
  });

  if (!user) throw new Error('Credenciais inválidas');

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error('Credenciais inválidas');

  await user.update({ lastLogin: new Date() });

  const token = generateToken(user);

  return {
    token,
    user: user.toPublicJSON(),
  };
};