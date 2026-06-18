// Importar rotas de lojas
const storeRoutes = require('./storeRoutes');

// Registar rotas
router.use('/stores', storeRoutes); // ← NOVO

module.exports = router;