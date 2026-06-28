const { Category } = require('../../models');

const DEFAULT_CATEGORIES = [
  { name: 'Moda & Vestuário', slug: 'fashion', icon: 'checkroom', description: 'Roupas, calçados e acessórios' },
  { name: 'Electrónica', slug: 'electronics', icon: 'devices', description: 'Aparelhos eletrónicos e acessórios' },
  { name: 'Casa & Decoração', slug: 'home', icon: 'weekend', description: 'Produtos para o lar e decoração' },
  { name: 'Saúde & Beleza', slug: 'beauty', icon: 'spa', description: 'Produtos de beleza e cuidados pessoais' },
  { name: 'Alimentação', slug: 'food', icon: 'restaurant', description: 'Comida e bebidas' },
  { name: 'Serviços', slug: 'services', icon: 'medical_services', description: 'Serviços locais' },
  { name: 'Kids & Brinquedos', slug: 'kids', icon: 'toys', description: 'Produtos para crianças e brinquedos' }
];

async function seedCategories() {
  try {
    for (const cat of DEFAULT_CATEGORIES) {
      await Category.findOrCreate({
        where: { slug: cat.slug },
        defaults: {
          name: cat.name,
          description: cat.description,
          icon: cat.icon,
          isActive: true
        }
      });
    }

    console.log('✅ Default categories seeded/verified');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  }
}

module.exports = seedCategories;
