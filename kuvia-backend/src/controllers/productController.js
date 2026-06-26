const { validationResult } = require('express-validator');
const productService = require('../services/productService');

/**
 * GET /api/seller/products
 * Listar produtos da loja do vendedor
 */
exports.getMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = req.query;

    const result = await productService.getSellerProducts(userId, filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ Erro ao listar produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar produtos'
    });
  }
};

/**
 * POST /api/seller/products
 * Criar novo produto
 */
exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const productData = req.body;
    const files = req.files; // Array de imagens

    const product = await productService.createProduct(userId, productData, files);

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso!',
      data: product
    });
  } catch (error) {
    console.error('❌ Erro ao criar produto:', error);
    
    // Apagar ficheiros enviados em caso de erro
    if (req.files && req.files.length > 0) {
      const fs = require('fs');
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Erro ao apagar ficheiro:', err);
        });
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao criar produto'
    });
  }
};

/**
 * GET /api/seller/products/:id
 * Obter produto por ID (apenas do vendedor)
 */
exports.getProductById = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const product = await productService.getProductById(userId, productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Erro ao obter produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar produto'
    });
  }
};

/**
 * PUT /api/seller/products/:id
 * Actualizar produto
 */
exports.updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const productId = req.params.id;
    const productData = req.body;
    const files = req.files; // Novas imagens

    const product = await productService.updateProduct(userId, productId, productData, files);

    res.json({
      success: true,
      message: 'Produto actualizado com sucesso!',
      data: product
    });
  } catch (error) {
    console.error('❌ Erro ao actualizar produto:', error);
    
    // Apagar ficheiros enviados em caso de erro
    if (req.files && req.files.length > 0) {
      const fs = require('fs');
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Erro ao apagar ficheiro:', err);
        });
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao actualizar produto'
    });
  }
};

/**
 * DELETE /api/seller/products/:id
 * Eliminar produto
 */
exports.deleteProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    await productService.deleteProduct(userId, productId);

    res.json({
      success: true,
      message: 'Produto eliminado com sucesso!'
    });
  } catch (error) {
    console.error('❌ Erro ao eliminar produto:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao eliminar produto'
    });
  }
};

/**
 * PATCH /api/seller/products/:id/status
 * Activar/Desactivar produto
 */
exports.toggleProductStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const { isActive } = req.body;

    const product = await productService.toggleProductStatus(userId, productId, isActive);

    res.json({
      success: true,
      message: `Produto ${isActive ? 'activado' : 'desactivado'} com sucesso!`,
      data: product
    });
  } catch (error) {
    console.error('❌ Erro ao alterar status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao alterar status do produto'
    });
  }
};