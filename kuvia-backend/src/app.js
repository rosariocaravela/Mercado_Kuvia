const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');

const app = express();

// Middlewares
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor Kuvia Backend está a funcionar!' });
});

// Sincronizar Banco de Dados e Iniciar Servidor
const PORT = process.env.PORT || 8080;

sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
  .then(() => {
    console.log('✅ Banco de dados sincronizado com sucesso!');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Kuvia rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro fatal ao iniciar o servidor:', error);
  });

module.exports = app;