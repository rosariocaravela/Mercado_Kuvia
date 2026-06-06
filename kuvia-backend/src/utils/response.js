/**
 * Resposta de sucesso
 * @param {Object} res - Response object
 * @param {Object} data - Dados a retornar
 * @param {String} message - Mensagem opcional
 * @param {Number} statusCode - Código HTTP (default: 200)
 */
exports.success = (res, data = null, message = 'Operação realizada com sucesso', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Resposta de erro
 * @param {Object} res - Response object
 * @param {String} message - Mensagem de erro
 * @param {Number} statusCode - Código HTTP (default: 400)
 * @param {Object} errors - Erros de validação (opcional)
 */
exports.error = (res, message = 'Erro ao processar pedido', statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Resposta de erro de validação
 * @param {Object} res - Response object
 * @param {Array} errors - Array de erros de validação
 */
exports.validationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Erro de validação',
    errors
  });
};

/**
 * Resposta de não autorizado
 * @param {Object} res - Response object
 * @param {String} message - Mensagem de erro
 */
exports.unauthorized = (res, message = 'Não autorizado') => {
  return res.status(401).json({
    success: false,
    message
  });
};

/**
 * Resposta de não encontrado
 * @param {Object} res - Response object
 * @param {String} message - Mensagem de erro
 */
exports.notFound = (res, message = 'Recurso não encontrado') => {
  return res.status(404).json({
    success: false,
    message
  });
};