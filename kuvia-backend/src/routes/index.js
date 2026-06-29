const express = require('express');
const router = express.Router();

// Importar rotas existentes
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const storeRoutes = require('./storeRoutes');
const productRoutes = require('./productRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const categoryRoutes = require('./categoryRoutes');
const adminRoutes = require('./adminRoutes');
router.use('/categories', categoryRoutes);
// Registar rotas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/stores', storeRoutes);
router.use('/products', productRoutes);
router.use('/admin', adminRoutes);

// ✨ NOVO: Rotas do dashboard do vendedor
router.use('/seller/dashboard', dashboardRoutes);
router.use('/seller/products', productRoutes);

module.exports = router;