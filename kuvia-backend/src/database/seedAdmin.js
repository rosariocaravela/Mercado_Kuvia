const { User } = require('../models');

async function seedAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'Administrador';
  const adminPhone = process.env.ADMIN_PHONE || '+258 840000000';

  if (!adminEmail || !adminPassword) {
    console.log('⚠️  Variáveis ADMIN_EMAIL/ADMIN_PASSWORD não configuradas. Pulando criação do administrador.');
    return;
  }

  try {
    let adminUser = await User.findOne({ where: { email: adminEmail } });

    if (adminUser) {
      if (adminUser.role !== 'ADMIN') {
        await adminUser.update({
          role: 'ADMIN',
          name: adminName,
          phone: adminPhone,
          password: adminPassword,
          isActive: true,
          emailVerified: true
        });
        console.log('✅ Utilizador existente promovido a administrador.');
      } else {
        console.log('✅ Utilizador administrador já existe.');
      }
      return;
    }

    await User.create({
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      emailVerified: true
    });

    console.log('✅ Utilizador administrador criado com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao criar utilizador administrador:', error.message);
  }
}

module.exports = seedAdminUser;
