const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController');
const { createStore, updateStore, searchStores } = require('../validators/storeValidator');
const { checkStoreActive, checkStoreOwnership, validateSlugAvailability } = require('../middlewares/storeMiddleware');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const upload = require('../config/uploadCloudinary');


// 🔓 ROTAS PÚBLICAS

// IMPORTANTE: rotas específicas SEMPRE antes das dinâmicas

// Verificar slug usando caminho fixo antes das rotas dinâmicas
router.get('/check-slug', validateSlugAvailability, storeController.checkSlug);
router.get('/slug/check', validateSlugAvailability, storeController.checkSlug);

// Pesquisa de lojas
router.get('/', searchStores, storeController.searchStores);

// Loja do vendedor actual
router.get('/my-store', authenticate, authorize('SELLER'), storeController.getMyStore);

// Produtos de loja
router.get('/:slug/products', checkStoreActive, storeController.getStoreProducts);

// Loja por slug (rota dinâmica sempre por último)
router.get('/:slug', checkStoreActive, storeController.getStoreBySlug);


// 🔐 ROTAS PROTEGIDAS

router.post(
  '/',
  authenticate,
  authorize('SELLER'),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  createStore,
  storeController.createStore
);

router.put(
  '/:id',
  authenticate,
  authorize('SELLER'),
  checkStoreOwnership,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  updateStore,
  storeController.updateStore
);

module.exports = router;