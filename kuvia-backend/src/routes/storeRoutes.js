const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { createStore, updateStore, searchStores } = require('../validators/storeValidator');
const { checkStoreActive, checkStoreOwnership, validateSlugAvailability } = require('../middlewares/storeMiddleware');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../config/upload'); // Configuração multer

// 🔓 ROTAS PÚBLICAS (não requerem autenticação)

// Pesquisa global de lojas (para página /explore)
router.get('/', searchStores, storeController.searchStores);

// Obter dados públicos de uma loja por slug
router.get('/:slug', checkStoreActive, storeController.getStoreBySlug);

// Listar produtos de uma loja
router.get('/:slug/products', checkStoreActive, storeController.getStoreProducts);

// Verificar disponibilidade de slug (para preview em tempo real no frontend)
router.get('/check-slug', validateSlugAvailability, storeController.checkSlug);

// 🔐 ROTAS PROTEGIDAS (requer autenticação + papel SELLER)

// Criar nova loja (apenas vendedores)
router.post('/', 
  authenticateToken, 
  authorizeRoles('SELLER'),
  createStore,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  storeController.createStore
);

// Actualizar loja existente (apenas dono)
router.put('/:id', 
  authenticateToken, 
  authorizeRoles('SELLER'),
  checkStoreOwnership,
  updateStore,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  storeController.updateStore
);

module.exports = router;