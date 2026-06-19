const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController');
const { createStore, updateStore, searchStores } = require('../validators/storeValidator');
const { checkStoreActive, checkStoreOwnership, validateSlugAvailability } = require('../middlewares/storeMiddleware');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const upload = require('../config/upload');


// 🔓 ROTAS PÚBLICAS

// IMPORTANTE: rotas específicas SEMPRE antes das dinâmicas

// Verificar slug (TEM QUE VIR PRIMEIRO)
router.get('/check-slug', validateSlugAvailability, storeController.checkSlug);

// Pesquisa de lojas
router.get('/', searchStores, storeController.searchStores);

// Produtos de loja
router.get('/:slug/products', checkStoreActive, storeController.getStoreProducts);

// Loja por slug (rota dinâmica sempre por último)
router.get('/:slug', checkStoreActive, storeController.getStoreBySlug);


// 🔐 ROTAS PROTEGIDAS

router.post(
  '/',
  authenticate,
  authorize('SELLER'),
  createStore,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  storeController.createStore
);

router.put(
  '/:id',
  authenticate,
  authorize('SELLER'),
  checkStoreOwnership,
  updateStore,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  storeController.updateStore
);

module.exports = router;