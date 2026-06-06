const sequelize = require('../config/database');

// Importar models
const User = require('./User');
const Client = require('./Client');
const Seller = require('./Seller');
const Store = require('./Store');
const Product = require('./Product');
const Category = require('./Category');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Review = require('./Review');
const Message = require('./Message');

// ========================================
// DEFINIÇÃO DE RELAÇÕES (ASSOCIAÇÕES)
// ========================================

// User <-> Client (1:1)
User.hasOne(Client, { foreignKey: 'userId', as: 'clientData', onDelete: 'CASCADE' });
Client.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Seller (1:1)
User.hasOne(Seller, { foreignKey: 'userId', as: 'sellerData', onDelete: 'CASCADE' });
Seller.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Seller <-> Store (1:N)
Seller.hasMany(Store, { foreignKey: 'sellerId', as: 'stores', onDelete: 'CASCADE' });
Store.belongsTo(Seller, { foreignKey: 'sellerId', as: 'seller' });

// Store <-> Product (1:N)
Store.hasMany(Product, { foreignKey: 'storeId', as: 'products', onDelete: 'CASCADE' });
Product.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// Category <-> Product (1:N)
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Category auto-relação (categorias pai/filho)
Category.hasMany(Category, { foreignKey: 'parentId', as: 'subcategories' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parentCategory' });

// Client <-> Order (1:N)
Client.hasMany(Order, { foreignKey: 'clientId', as: 'orders' });
Order.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

// Store <-> Order (1:N)
Store.hasMany(Order, { foreignKey: 'storeId', as: 'orders' });
Order.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// Seller <-> Order (1:N)
Seller.hasMany(Order, { foreignKey: 'sellerId', as: 'orders' });
Order.belongsTo(Seller, { foreignKey: 'sellerId', as: 'seller' });

// Order <-> OrderItem (1:N)
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Product <-> OrderItem (1:N)
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Client <-> Review (1:N)
Client.hasMany(Review, { foreignKey: 'clientId', as: 'reviews' });
Review.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

// Product <-> Review (1:N)
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Store <-> Review (1:N)
Store.hasMany(Review, { foreignKey: 'storeId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// User <-> Message (enviadas e recebidas)
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

// ========================================
// EXPORTAR TODOS OS MODELS
// ========================================
module.exports = {
  sequelize,
  User,
  Client,
  Seller,
  Store,
  Product,
  Category,
  Order,
  OrderItem,
  Review,
  Message
};