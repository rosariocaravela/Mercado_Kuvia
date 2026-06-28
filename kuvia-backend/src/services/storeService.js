const { Op, Sequelize } = require('sequelize');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Seller = require('../models/Seller');
const User = require('../models/User');

/**
 * Criar nova loja (apenas para vendedores verificados)
 */
exports.createStore = async (sellerId, storeData, files = {}) => {
  const existingStore = await Store.findOne({
    where: { sellerId }
  });

  if (existingStore) {
    throw new Error('Este vendedor já possui uma loja.');
  }

  let whatsapp = storeData.whatsapp_number || '';
  const whatsappClean = whatsapp.replace(/\D/g, '');

  if (whatsappClean.startsWith('258')) {
    whatsapp = `+${whatsappClean}`;
  } else {
    whatsapp = `+258${whatsappClean}`;
  }

  const categories = (() => {
    if (Array.isArray(storeData.categories)) return storeData.categories;
    if (typeof storeData.categories === 'string') {
      try {
        const parsed = JSON.parse(storeData.categories);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (error) {
        return storeData.categories ? [storeData.categories] : [];
      }
    }
    return [];
  })();

  const data = {
    name: storeData.name,
    slug: storeData.slug?.toLowerCase(),
    whatsapp_number: whatsapp,
    description: storeData.description || '',
    sellerId,
    is_active: false,
    status: 'PENDING',
    categories
  };

  if (storeData.theme_config) {
    data.theme_config =
      typeof storeData.theme_config === 'string'
        ? JSON.parse(storeData.theme_config)
        : storeData.theme_config;
  }

  if (files.logo?.[0]) {
    data.logo_url = `/uploads/stores/${files.logo[0].filename}`;
  }

  if (files.banner?.[0]) {
    data.banner_url = `/uploads/stores/${files.banner[0].filename}`;
  }

  const store = await Store.create(data);
  return store.toJSON();
};

/**
 * Obter loja do vendedor pelo sellerId
 */
exports.getStoreBySeller = async (sellerId) => {
  const store = await Store.findOne({
    where: { sellerId },
    include: [
      {
        model: Seller,
        as: 'seller',
        attributes: ['id', 'businessName', 'rating', 'verified'],
        include: [
          { model: User, as: 'user', attributes: ['fullName'] }
        ]
      }
    ]
  });

  return store ? store.toJSON() : null;
};

/**
 * Obter dados públicos da loja por slug (para página pública)
 */
exports.getStorePublicData = async (slug) => {
  const store = await Store.findOne({
    where: {
      slug: slug.toLowerCase(),
      is_active: true,
      status: 'APPROVED'
    },
    include: [
      {
        model: Seller,
        as: 'owner',
        attributes: ['id', 'businessName', 'rating', 'verified'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['fullName']
          }
        ]
      }
    ],
    attributes: {
      exclude: ['sellerId', 'createdAt', 'updatedAt']
    }
  });

  return store ? store.toJSON() : null;
};

/**
 * Listar produtos de uma loja com filtros e paginação
 */
exports.getStoreProducts = async (storeId, {
  page = 1,
  limit = 20,
  categoryId,
  minPrice,
  maxPrice,
  search
} = {}) => {

  const where = {
    storeId,
    isActive: true
  };

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } }
    ];
  }

  if (categoryId) where.categoryId = categoryId;

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = Number(minPrice);
    if (maxPrice) where.price[Op.lte] = Number(maxPrice);
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Product.findAndCountAll({
    where,
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'icon']
      }
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    attributes: [
      'id',
      'name',
      'slug',
      'price',
      'stock',
      'images',
      'storeId',
      'createdAt',
      'views'
    ]
  });

  return {
    count,
    products: rows.map(p => p.toJSON()),
    page,
    limit,
    totalPages: Math.ceil(count / limit)
  };
};

/**
 * Pesquisa global de lojas (para página /explore)
 */
exports.searchStores = async ({
  search = '', 
  page = 1, 
  limit = 12,
  categories,
  province,
  minRating
} = {}) => {
  // ✅ CORREÇÃO: is_active (com underscore)
  const where = {
    is_active: true,
    status: 'APPROVED'
  };

  // Filtro de pesquisa
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Filtro por categorias (se Store tem campo categories JSONB)
  if (categories) {
    const catArray = categories.split(',');
    where.categories = { [Op.overlap]: catArray };
  }

  // Filtro por avaliação mínima (via seller)
  if (minRating) {
    // Nota: rating está no Seller, não na Store
    // Requer join ou subquery
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { count, rows } = await Store.findAndCountAll({
    where,
    include: [
      {
        model: Seller,
        as: 'seller',
        attributes: ['id', 'businessName', 'rating'],
        include: [{ model: User, as: 'user', attributes: ['name'] }]
      }
    ],
    limit: parseInt(limit),
    offset,
    order: [['id', 'DESC']],
    // ✅ Adicionar mais campos úteis
    attributes: [
      'id', 
      'slug', 
      'name', 
      'description', 
      'logo_url', 
      'banner_url',  // ← ADICIONAR
      'whatsapp_number',
    ]
  });

  return {
    count,
    stores: rows.map(s => s.toJSON()),
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(count / limit)
  };
};

/**
 * Actualizar loja (apenas dono)
 */
exports.updateStore = async (storeId, updates, files = {}) => {
  const store = await Store.findByPk(storeId);
  if (!store) throw new Error('Loja não encontrada');

  // Processar uploads se existirem
  if (files.logo?.[0]) {
    updates.logo_url = `/uploads/stores/${files.logo[0].filename}`;
  }
  if (files.banner?.[0]) {
    updates.banner_url = `/uploads/stores/${files.banner[0].filename}`;
  }

  // Actualizar campos permitidos
  const allowedFields = ['name', 'slug', 'description', 'whatsapp_number', 'theme_config'];
  const updatesFiltered = Object.keys(updates)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = updates[key];
      return obj;
    }, {});

  await store.update(updatesFiltered);
  return store.toJSON();
};

/**
 * Verificar disponibilidade de slug
 */
exports.isSlugAvailable = async (slug, excludeStoreId = null) => {
  const where = { slug: slug.toLowerCase() };
  if (excludeStoreId) {
    where.id = { [Op.ne]: excludeStoreId };
  }
  const exists = await Store.findOne({ where });
  return !exists;
};

/**
 * Obter loja do vendedor actual
 */
exports.getSellerStore = async (sellerId) => {
  return Store.findOne({
    where: { sellerId },
    include: [
      {
        model: Seller,
        as: 'owner',
        include: [{ model: User, as: 'user', attributes: ['fullName', 'email'] }]
      }
    ]
  });
};