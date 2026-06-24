const express = require('express');
const cors = require('cors');
require('dotenv').config();

const initDatabase = require('./database/init');

const app = express();


// Middlewaresdados
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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