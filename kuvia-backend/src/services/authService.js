const { User, Client, Seller } = require('../models');
const { generateToken } = require('../utils/jwt');
const { comparePassword } = require('../utils/password');

// Serviço de autenticação: regras de negócio e operações críticas com a DB.
// Comentários focam em decisões que outros desenvolvedores precisam entender.

/**
 * REGISTAR CLIENTE
 * - Garante unicidade de email e telefone antes de criar o utilizador.
 * - Cria também o registo em `Client` para separar informação específica de clientes.
 * - Retorna token JWT com payload mínimo para identificação do utilizador.
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

  // Separar entidade Client para futuras extensões sem inflar o User
  await Client.create({ userId: user.id });

  const token = generateToken(user);

  return {
    token,
    user: user.toPublicJSON(),
  };
};

/**
 * REGISTAR VENDEDOR
 * - Valida tipos de negócio permitidos para manter consistência (catalogo controlado).
 * - Cria `Seller` com referência ao `User`. O campo `whatsapp` fica com valor default
 *   para o telefone do utilizador caso não seja fornecido.
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
 * - Aceita email ou telefone como identificador (flexibilidade para utilizadores).
 * - Atualiza `lastLogin` para auditoria/telemetria.
 * - Lança erros genéricos em credenciais inválidas para evitar leaks de informação.
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

  // Atualizar último login para métricas e detecção de atividade suspeita
  await user.update({ lastLogin: new Date() });

  const token = generateToken(user);

  return {
    token,
    user: user.toPublicJSON(),
  };
};