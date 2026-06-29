const { sequelize } = require('../models');
const seedCategories = require('./seeds/seedCategories');
const seedAdminUser = require('./seedAdmin');

async function initDatabase() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o PostgreSQL estabelecida com sucesso!');

        await sequelize.sync({ alter: true }); // sincroniza alterações nos modelos com o banco
        console.log('✅ Tabelas sincronizadas');

        // Seed default categories (idempotent)
        await seedCategories();

        // Criar/garantir o utilizador administrador a partir de variáveis de ambiente
        await seedAdminUser();

    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error);
    }

}

module.exports = initDatabase;