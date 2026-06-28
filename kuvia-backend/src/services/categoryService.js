const Category = require('../models/Category');

// Cache simples
let cache = null;

exports.getAllCategories = async () => {
  if (cache) return cache;
  
  const categories = await Category.findAll({
    where: { isActive: true },
    order: [['name', 'ASC']]
  });
  
  cache = categories;
  return categories;
};

exports.clearCache = () => {
  cache = null;
};