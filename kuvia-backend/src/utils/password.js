const bcrypt = require('bcryptjs');

/**
 * Encriptar senha
 * @param {String} password - Senha em texto plano
 * @returns {String} Senha encriptada
 */
exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Comparar senha com hash
 * @param {String} password - Senha em texto plano
 * @param {String} hashedPassword - Senha encriptada
 * @returns {Boolean} True se correspondem
 */
exports.comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};