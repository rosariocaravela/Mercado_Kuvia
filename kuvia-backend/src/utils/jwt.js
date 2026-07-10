const jwt = require('jsonwebtoken');

// JWT helpers
// - `generateToken` cria um JWT assinado com `JWT_SECRET` contendo apenas
//   informações mínimas necessárias para autenticação (id, email, role).
// - Não incluir dados sensíveis no token (ex.: senhas).
// - Em produção, `JWT_SECRET` deve ser forte e ser gerido via variáveis de ambiente
//   (rotacionamento/blacklist de tokens deve ser considerado para logout/comprometimento).
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// Verifica o token e retorna o payload ou `null` se inválido/expirado.
// Observação: falhas são silenciadas aqui (retorna null) para permitir
// que controladores tratem autorização explicitamente; logs centralizados
// são recomendados para auditoria de tentativas inválidas.
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Decodifica sem validar — útil apenas para operações não críticas
// (por exemplo, leitura rápida de um campo). Não usar para autorizar ações.
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};