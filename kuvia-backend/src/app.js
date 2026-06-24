const express = require('express');
const cors = require('cors');
require('dotenv').config();

const initDatabase = require('./database/init');

const app = express();


// Middlewares

// Lista de domínios permitidos
const allowedOrigins = [
  process.env.FRONTEND_URL, // O link do Render em produção
  'http://localhost:5173',  // O link do Vite local

].filter(Boolean); // Remove valores indefinidos

app.use(cors({
  origin: function (origin, callback) {
    // Permite solicitações sem origem (ex: Postman ou solicitações de servidor para servidor)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueio de CORS: Origem não permitida'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('src/uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor Kuvia Backend está a funcionar!',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api', require('./routes'));

const PORT = process.env.PORT || 8080;

// DB + Server start
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Kuvia rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro fatal ao iniciar o servidor:', error);
  });

module.exports = app;