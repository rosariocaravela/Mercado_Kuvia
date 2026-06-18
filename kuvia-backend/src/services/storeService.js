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
  // Verificar se vendedor já tem loja
  const existingStore = await Store.findOne({ where: { sellerId: sellerId } });
  if (existingStore) {
    throw new Error('Este vendedor já possui uma loja. Cada vendedor pode ter apenas uma loja.');
  }

  // Preparar dados para criação
  const data = {
    ...storeData,
    sellerId: sellerId,
    is_active: false, // Requer aprovação admin
    status: 'PENDING'
  };

  // Processar uploads se existirem
  if (files.logo?.[0]) {
    data.logo_url = `/uploads/stores/${files.logo[0].filename}`;
  }
  if (files.banner?.[0]) {
    data.banner_url = `/uploads/stores/${files.banner[0].filename}`;
  }

  // Criar loja
  const store = await Store.create(data);
  
  // Retornar dados públicos (sem campos sensíveis)
  return store.toJSON();
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
        include: [{ model: User, as: 'user', attributes: ['fullName'] }]
      }
    ],
    attributes: { 
      exclude: ['owner_id', 'is_active', 'status', 'createdAt', 'updatedAt'] 
    }
  });

  if (!store) return null;
  return store.toJSON();
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
  search,
  condition 
} = {}) => {
  const where = { 
    storeId, 
    is_active: true // Apenas produtos activos
  };
  
  // Filtro de pesquisa por texto
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } }
    ];
  }
  
  // Filtros adicionais
  if (categoryId) where.categoryId = categoryId;
  if (condition) where.condition = condition;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
    if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { count, rows } = await Product.findAndCountAll({
    where,
    include: [
      { 
        model: Category, 
        as: 'category', 
        attributes: ['id', 'name', 'slug', 'icon'] 
      }
    ],
    limit: parseInt(limit),
    offset,
    order: [['createdAt', 'DESC']],
    attributes: [
      'id', 'title', 'slug', 'price', 'currency', 'condition', 
      'stock', 'images', 'storeId', 'createdAt', 'views'
    ]
  });

  return {
    count,
    products: rows.map(p => p.toJSON()),
    page: parseInt(page),
    limit: parseInt(limit),
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
  province,
  category 
} = {}) => {
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
  
  // Filtro por província (via seller)
  if (province) {
    // Nota: requer join com Seller para filtrar por localização
    // Implementação simplificada: filtrar no frontend ou adicionar campo na Store
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { count, rows } = await Store.findAndCountAll({
    where,
    include: [
      { 
        model: Seller, 
        as: 'owner', 
        attributes: ['id', 'businessName', 'rating', 'verified'],
        include: [{ model: User, as: 'user', attributes: ['fullName'] }]
      }
    ],
    limit: parseInt(limit),
    offset,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'slug', 'name', 'description', 'logo_url', 'whatsapp_number']
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
    where: { owner_id: sellerId },
    include: [
      { 
        model: Seller, 
        as: 'owner',
        include: [{ model: User, as: 'user', attributes: ['fullName', 'email'] }]
      }
    ]
  });
};