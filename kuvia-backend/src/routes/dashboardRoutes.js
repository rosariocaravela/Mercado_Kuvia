const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Todas as rotas do dashboard requerem autenticação e papel SELLER
router.use(authenticate);
router.use(authorize('SELLER'));

// Rota principal - retorna todos os dados do dashboard
router.get('/', dashboardController.getDashboard);

// Rotas específicas (para refresh parcial)
router.get('/stats', dashboardController.getStats);
router.get('/sales-trend', dashboardController.getSalesTrend);
router.get('/activity', dashboardController.getActivity);

module.exports = router;