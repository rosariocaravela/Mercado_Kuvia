// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();

// ✅ Importações com verificação
let productController, authenticateToken, authorizeRoles, upload;

try {
  productController = require('../controllers/productController');
} catch (error) {
  console.error('❌ Erro ao importar productController:', error.message);
  throw new Error('productController não encontrado. Verifica se o ficheiro existe.');
}

try {
  const authMiddleware = require('../middlewares/authMiddleware');
  
  // ✅ Tenta diferentes nomes comuns de exportação
  authenticateToken = authMiddleware.authenticateToken || authMiddleware.authenticate || authMiddleware.auth;
  authorizeRoles = authMiddleware.authorizeRoles || authMiddleware.authorize || authMiddleware.checkRole;
  
  if (!authenticateToken) {
    console.error('❌ Middlewares disponíveis:', Object.keys(authMiddleware));
    throw new Error('authenticateToken não encontrado no authMiddleware');
  }
  
  if (!authorizeRoles) {
    console.error('❌ Middlewares disponíveis:', Object.keys(authMiddleware));
    throw new Error('authorizeRoles não encontrado no authMiddleware');
  }
} catch (error) {
  console.error('❌ Erro ao importar authMiddleware:', error.message);
  throw error;
}

try {
  upload = require('../config/upload');
} catch (error) {
  console.error('❌ Erro ao importar upload:', error.message);
  throw new Error('Configuração de upload não encontrada');
}

// ✅ Middleware de autenticação para todas as rotas
router.use(authenticateToken);

// ✅ Middleware de autorização (apenas vendedores)
router.use(authorizeRoles('SELLER'));

/**
 * GET /api/seller/products
 * Listar produtos do vendedor
 */
router.get('/', productController.getMyProducts);

/**
 * POST /api/seller/products
 * Criar novo produto (com upload de até 5 imagens)
 */
router.post(
  '/',
  upload.array('images', 5),
  productController.createProduct
);

/**
 * GET /api/seller/products/:id
 * Obter produto específico
 */
router.get('/:id', productController.getProductById);

/**
 * PUT /api/seller/products/:id
 * Actualizar produto (com upload opcional de novas imagens)
 */
router.put(
  '/:id',
  upload.array('images', 5),
  productController.updateProduct
);

/**
 * DELETE /api/seller/products/:id
 * Eliminar produto
 */
router.delete('/:id', productController.deleteProduct);

/**
 * PATCH /api/seller/products/:id/status
 * Activar/Desactivar produto
 */
router.patch('/:id/status', productController.toggleProductStatus);

module.exports = router;