const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

// Rotas públicas
router.post('/register/client', authController.registerClient);
router.post('/register/seller', authController.registerSeller);
router.post('/login', authController.login);

// Rotas protegidas
router.get('/me', authenticate, authController.getCurrentUser);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;