const { sequelize } = require('../models');

async function initDatabase() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o PostgreSQL estabelecida com sucesso!');

        await sequelize.sync({ alter: true }); // sincroniza alterações nos modelos com o banco
        console.log('✅ Tabelas sincronizadas');
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error);
    }

}

module.exports = initDatabase;