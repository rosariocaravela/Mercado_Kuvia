const { body, param, query } = require('express-validator');
const { slugify } = require('../utils/slugify');

// Validações para criar loja (POST /stores)
exports.createStore = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nome da loja é obrigatório')
    .isLength({ min: 3, max: 100 }).withMessage('Nome deve ter entre 3 e 100 caracteres'),
  
  body('slug')
    .trim()
    .notEmpty().withMessage('URL personalizado é obrigatório')
    .isLength({ min: 3, max: 50 }).withMessage('URL deve ter entre 3 e 50 caracteres')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('URL só pode conter letras minúsculas, números e hífens')
    .customSanitizer(val => val.toLowerCase()),
  
  body('whatsapp_number')
    .trim()
    .notEmpty().withMessage('Número WhatsApp é obrigatório')
    .matches(/^(\+258)?[8][2-467]\d{7}$/).withMessage('Formato inválido. Ex: +258 84 123 4567')
    .customSanitizer(val => val.replace(/\D/g, '').startsWith('258') ? val : `258${val.replace(/\D/g, '')}`),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Descrição máxima: 500 caracteres'),
  
  body('theme_config')
    .optional()
    .isObject().withMessage('Configuração de tema deve ser um objecto JSON'),
  
  // Validação assíncrona de slug único (após validações síncronas)
  body('slug').custom(async (slug) => {
    const Store = require('../models/Store');
    const exists = await Store.findOne({ where: { slug } });
    if (exists) throw new Error('Este URL já está em uso. Escolha outro.');
    return true;
  })
];

// Validações para actualizar loja (PUT /stores/:id)
exports.updateStore = [
  param('id').isUUID().withMessage('ID da loja inválido'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Nome deve ter entre 3 e 100 caracteres'),
  
  body('slug')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .customSanitizer(val => val.toLowerCase()),
  
  body('whatsapp_number')
    .optional()
    .trim()
    .matches(/^(\+258)?[8][2-467]\d{7}$/),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }),
  
  body('theme_config')
    .optional()
    .isObject()
];

// Validações para pesquisa de lojas (GET /stores)
exports.searchStores = [
  query('search').optional().trim().isLength({ max: 100 }),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('category').optional().trim(),
  query('province').optional().trim()
];