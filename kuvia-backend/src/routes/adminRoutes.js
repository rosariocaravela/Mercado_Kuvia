const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/sellers', authenticate, authorize('ADMIN'), adminController.getSellerApprovals);
router.put('/sellers/:id/approval', authenticate, authorize('ADMIN'), adminController.updateSellerApproval);

module.exports = router;
