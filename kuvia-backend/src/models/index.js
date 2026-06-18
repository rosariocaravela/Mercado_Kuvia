const sequelize = require('../config/database');

// Models
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
// RELAÇÕES
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
Store.hasMany(Product, { foreignKey: 'storeId', as: 'storeProducts' });
Product.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// Category <-> Product (1:N)
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'categoryProducts' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Category auto-relação
Category.hasMany(Category, { foreignKey: 'parentId', as: 'subcategories' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parentCategory' });

// Client <-> Order
Client.hasMany(Order, { foreignKey: 'clientId', as: 'orders' });
Order.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

// Store <-> Order
Store.hasMany(Order, { foreignKey: 'storeId', as: 'orders' });
Order.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// Seller <-> Order
Seller.hasMany(Order, { foreignKey: 'sellerId', as: 'orders' });
Order.belongsTo(Seller, { foreignKey: 'sellerId', as: 'seller' });

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Product <-> OrderItem
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Client <-> Review
Client.hasMany(Review, { foreignKey: 'clientId', as: 'reviews' });
Review.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

// Product <-> Review
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Store <-> Review
Store.hasMany(Review, { foreignKey: 'storeId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// Messages
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

// ========================================
// EXPORT
// ========================================
module.exports = {
  User,
  Client,
  Seller,
  Category,
  Product,
  Order,
  OrderItem,
  Review,
  Message,
  Store
};