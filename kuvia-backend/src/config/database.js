const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

// Testar a conexão
sequelize.authenticate()
  .then(() => console.log('✅ Conexão com o PostgreSQL estabelecida com sucesso!'))
  .catch((err) => console.error('❌ Erro ao conectar ao banco de dados:', err));

module.exports = sequelize;