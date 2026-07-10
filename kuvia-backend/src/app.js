const express = require('express');
const cors = require('cors');
require('dotenv').config();

const initDatabase = require('./database/init');

const app = express();

// Limites de tamanho aplicados ao body para suportar uploads via Cloudinary
// (O upload em si é feito pelo Cloudinary SDK, mas o frontend pode enviar
// imagens inline em alguns endpoints -- ajustar conforme necessidade).
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middlewares
// - CORS restrito por `FRONTEND_URL` (definir em produção para o domínio real)
// - `credentials: true` permite cookies/CORS com credenciais (evitar se não usar)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Timeout para requisições (60 segundos)
// - Importante para uploads/requests longos; em infra com proxies verifique
//   timeouts do proxy/Load Balancer também.
app.use((req, res, next) => {
  req.setTimeout(60000);
  res.setTimeout(60000);
  next();
});

// Observação: imagens são servidas pelo Cloudinary. Não expor diretório local
// `uploads/` em produção a menos que tenha um motivo explícito.
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor Kuvia Backend está a funcionar!',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', require('./routes'));

const PORT = process.env.PORT || 8080;

// Inicializa a base de dados e inicia o servidor.
// - Em produção, preferível usar um process manager (PM2/systemd) e health checks
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