const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar models
const { sequelize } = require('./models');

const app = express();

// Middlewares
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir ficheiros estáticos
app.use('/uploads', express.static('src/uploads'));

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor Kuvia Backend está a funcionar!',
    timestamp: new Date().toISOString()
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    name: 'Kuvia API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      stores: '/api/stores',
      orders: '/api/orders'
    }
  });
});

// Rotas de API principais
app.use('/api', require('./routes'));

// Sincronizar Banco de Dados e Iniciar Servidor
const PORT = process.env.PORT || 8080;

sequelize.sync()
  .then(() => {
    console.log('✅ Banco de dados sincronizado com sucesso!');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Kuvia rodando em http://localhost:${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro fatal ao iniciar o servidor:', error);
  });

module.exports = app;