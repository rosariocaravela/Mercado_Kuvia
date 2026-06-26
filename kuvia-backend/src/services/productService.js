const { Op } = require('sequelize');
const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const Store = require('../models/Store');
const Seller = require('../models/Seller');
const fs = require('fs');
const path = require('path');
const { title } = require('process');

/**
 * Obter produtos do vendedor (via loja)
 */
exports.getSellerProducts = async (userId, filters = {}) => {
  // 1. Obter seller e loja
  const seller = await Seller.findOne({ where: { userId } });
  if (!seller) throw new Error('Perfil de vendedor não encontrado');

  const store = await Store.findOne({ where: { sellerId: seller.id } });
  if (!store) throw new Error('Loja não encontrada');

  // 2. Construir filtros
  const where = { storeId: store.id };

  if (filters.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${filters.search}%` } },
      { description: { [Op.iLike]: `%${filters.search}%` } }
    ];
  }

  if (filters.status === 'active') where.isActive = true;
  if (filters.status === 'inactive') where.isActive = false;
  if (filters.status === 'low_stock') {
    where.stock = { [Op.lte]: 5, [Op.gt]: 0 };
    where.isActive = true;
  }

  // 3. Ordenação
  let order = [['createdAt', 'DESC']];
  if (filters.sort === 'oldest') order = [['createdAt', 'ASC']];
  if (filters.sort === 'price_asc') order = [['price', 'ASC']];
  if (filters.sort === 'price_desc') order = [['price', 'DESC']];
  if (filters.sort === 'most_viewed') order = [['views', 'DESC']];

  // 4. Paginação
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 12;
  const offset = (page - 1) * limit;

  // 5. Buscar produtos
  const { count, rows } = await Product.findAndCountAll({
    where,
    include: [
      {
        model: ProductImage,
        as: 'images',
        attributes: ['id', 'url', 'isPrimary', 'order']
      }
    ],
    limit,
    offset,
    order
  });

  return {
    products: rows,
    count,
    page,
    limit,
    totalPages: Math.ceil(count / limit)
  };
};

/**
 * Criar novo produto
 */
exports.createProduct = async (userId, productData, files = []) => {
  const seller = await Seller.findOne({ where: { userId } });
  if (!seller) throw new Error('Perfil de vendedor não encontrado');

  const store = await Store.findOne({ where: { sellerId: seller.id } });
  if (!store) throw new Error('Loja não encontrada');

  // ✅ NORMALIZAÇÃO DE DADOS
  const name = productData.name || productData.title;

  if (!name) {
    throw new Error('Nome do produto é obrigatório');
  }

  const price = parseFloat(productData.price);
  if (isNaN(price)) {
    throw new Error('Preço inválido');
  }

  const product = await Product.create({
    name,
    slug: generateSlug(name),
    description: productData.description || '',
    price,
    stock: parseInt(productData.stock || 0),
    categoryId: productData.categoryId || null,
    storeId: store.id,
    isActive: productData.isActive !== false
  });

  // imagens
  if (files?.length > 0) {
    await ProductImage.bulkCreate(
      files.map((file, index) => ({
        productId: product.id,
        url: `/uploads/products/${file.filename}`,
        isPrimary: index === 0,
        order: index
      }))
    );
  }

  return Product.findByPk(product.id, {
    include: [{ model: ProductImage, as: 'images' }]
  });
};

/**
 * Actualizar produto
 */
exports.updateProduct = async (userId, productId, productData, files = []) => {
  const product = await exports.getProductById(userId, productId);
  if (!product) throw new Error('Produto não encontrado');

  const name = productData.name || productData.title;

  const updateData = {
    name: name || product.name,
    slug: name ? generateSlug(name) : product.slug,
    description: productData.description ?? product.description,
    price: productData.price ? parseFloat(productData.price) : product.price,
    stock: productData.stock ? parseInt(productData.stock) : product.stock,
    categoryId: productData.categoryId ?? product.categoryId,
    isActive: productData.isActive ?? product.isActive
  };

  await product.update(updateData);

  if (files?.length > 0) {
    const existingImagesCount = await ProductImage.count({
      where: { productId: product.id }
    });

    await ProductImage.bulkCreate(
      files.map((file, index) => ({
        productId: product.id,
        url: `/uploads/products/${file.filename}`,
        isPrimary: existingImagesCount === 0 && index === 0,
        order: existingImagesCount + index
      }))
    );
  }

  return Product.findByPk(product.id, {
    include: [{ model: ProductImage, as: 'images' }]
  });
};

/**
 * Eliminar produto
 */
exports.deleteProduct = async (userId, productId) => {
  const product = await this.getProductById(userId, productId);
  if (!product) throw new Error('Produto não encontrado');

  // 1. Apagar ficheiros de imagem do disco
  const images = await ProductImage.findAll({ where: { productId: product.id } });
  images.forEach(image => {
    const filePath = path.join(__dirname, '..', image.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  // 2. Apagar registos de imagens na BD
  await ProductImage.destroy({ where: { productId: product.id } });

  // 3. Apagar produto
  await product.destroy();
};

/**
 * Activar/Desactivar produto
 */
exports.toggleProductStatus = async (userId, productId, isActive) => {
  const product = await this.getProductById(userId, productId);
  if (!product) throw new Error('Produto não encontrado');

  await product.update({ isActive });
  return product;
};

/**
 * Helper: Gerar slug a partir do título
 */
function generateSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}