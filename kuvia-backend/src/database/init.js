const { sequelize } = require('../models');
const seedCategories = require('./seeds/seedCategories');
const seedAdminUser = require('./seedAdmin');

async function initDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o PostgreSQL estabelecida com sucesso!');

        // Em ambientes de produção não executamos `sync({ alter: true })` automaticamente
        // porque isso pode alterar tabelas em tempo de execução e causar perda de dados.
        // Em vez disso, usar migrações (sequelize-cli / Umzug) para controlar alterações.
        if (process.env.NODE_ENV === 'production') {
            console.log('🚀 Ambiente de produção detectado.');
            console.log('📦 O esquema do banco será gerenciado por migrations.');
           
        } else {
            await sequelize.sync({ alter: true }); // sincroniza alterações nos modelos com o banco (apenas dev)
            console.log('Tabelas sincronizadas (desenvolvimento)');
        }

        // Seed default categories (idempotent)
        await seedCategories();

        // Criar/garantir o utilizador administrador a partir de variáveis de ambiente
        await seedAdminUser();

    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error);
    }

}

module.exports = initDatabase;