const { sequelize } = require('../models');

async function initDatabase() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o PostgreSQL estabelecida com sucesso!');

        await sequelize.sync(); // sem alter
        console.log('✅ Tabelas sincronizadas');
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error);
    }

}

module.exports = initDatabase;