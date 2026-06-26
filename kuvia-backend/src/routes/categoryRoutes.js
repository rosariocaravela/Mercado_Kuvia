const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET /api/categories - Listar todas as categorias (público)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'slug', 'icon', 'description']
    });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar categorias'
    });
  }
});

// GET /api/categories/:id - Obter categoria específica
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar categoria'
    });
  }
});

module.exports = router;