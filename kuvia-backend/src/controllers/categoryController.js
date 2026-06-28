const categoryService = require('../services/categoryService');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ success: false, message: 'Erro ao carregar categorias' });
  }
};