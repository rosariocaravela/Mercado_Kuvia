const { validationResult } = require('express-validator');
const storeService = require('../services/storeService');
const Store = require('../models/Store');

/**
 * POST /api/stores
 * Criar nova loja (apenas vendedores autenticados)
 */
exports.createStore = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array().map(e => ({ field: e.param, message: e.msg })) 
      });
    }

    // Verificar se utilizador é vendedor
    if (req.user?.role !== 'SELLER') {
      return res.status(403).json({ 
        success: false, 
        message: 'Apenas vendedores podem criar lojas.' 
      });
    }

    // Obter seller_id do utilizador actual
    const Seller = require('../models/Seller');
    const seller = await Seller.findOne({ where: { userId: req.user.id } });
    if (!seller) {
      return res.status(400).json({ 
        success: false, 
        message: 'Perfil de vendedor não encontrado. Complete o seu registo primeiro.' 
      });
    }

    // Criar loja
    const store = await storeService.createStore(
      seller.id, 
      req.body, 
      req.files // { logo: [file], banner: [file] }
    );

    res.status(201).json({
      success: true,
      message: 'Loja criada com sucesso! Aguarda aprovação do administrador.',
      data: {
        id: store.id,
        name: store.name,
        slug: store.slug,
        status: store.status
      }
    });
  } catch (error) {
    console.error('❌ Erro ao criar loja:', error);
    
    if (error.message.includes('já possui uma loja')) {
      return res.status(409).json({ success: false, message: error.message });
    }
    if (error.message.includes('URL já está em uso')) {
      return res.status(409).json({ success: false, message: error.message });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao criar loja. Tente novamente.' 
    });
  }
};

/**
 * GET /api/stores/:slug
 * Obter dados públicos de uma loja (página da loja)
 */
exports.getStoreBySlug = async (req, res) => {
  try {
    // req.store vem do middleware checkStoreActive
    const store = req.store;
    
    if (!store) {
      return res.status(404).json({ 
        success: false, 
        message: 'Loja não encontrada ou não está activa.' 
      });
    }

    res.json({ success: true, data: store });
  } catch (error) {
    console.error('❌ Erro ao obter loja:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao carregar dados da loja.' 
    });
  }
};

/**
 * GET /api/stores/:slug/products
 * Listar produtos de uma loja com filtros
 */
exports.getStoreProducts = async (req, res) => {
  try {
    const storeId = req.store.id; // Vem do middleware
    const result = await storeService.getStoreProducts(storeId, req.query);
    
    res.json({ 
      success: true, 
      data: result,
      meta: {
        store: { name: req.store.name, slug: req.store.slug }
      }
    });
  } catch (error) {
    console.error('❌ Erro ao listar produtos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao carregar produtos da loja.' 
    });
  }
};

/**
 * GET /api/stores
 * Pesquisa global de lojas (página /explore)
 */
exports.searchStores = async (req, res) => {
  try {
    // Validar parâmetros de query
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array().map(e => ({ field: e.param, message: e.msg })) 
      });
    }

    const result = await storeService.searchStores(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('❌ Erro na pesquisa global:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao pesquisar lojas.' 
    });
  }
};

/**
 * PUT /api/stores/:id
 * Actualizar loja (apenas dono)
 */
exports.updateStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array().map(e => ({ field: e.param, message: e.msg })) 
      });
    }

    const store = await storeService.updateStore(
      req.params.id, 
      req.body, 
      req.files
    );

    res.json({ 
      success: true, 
      message: 'Loja actualizada com sucesso!', 
      data: store 
    });
  } catch (error) {
    console.error('❌ Erro ao actualizar loja:', error);
    
    if (error.message.includes('URL já está em uso')) {
      return res.status(409).json({ success: false, message: error.message });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao actualizar loja.' 
    });
  }
};

/**
 * GET /api/stores/check-slug?slug=nome-da-loja
 * Verificar disponibilidade de slug (para preview em tempo real)
 */
exports.checkSlug = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: errors.array()[0].msg 
      });
    }

    const { slug } = req.query;
    const excludeId = req.user?.storeId || null; // Excluir própria loja no update
    
    const available = await storeService.isSlugAvailable(slug, excludeId);
    
    res.json({ 
      success: true, 
      available,
      message: available 
        ? '✅ URL disponível!' 
        : '❌ Este URL já está em uso. Tente outro nome.' 
    });
  } catch (error) {
    console.error('❌ Erro ao verificar slug:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao verificar disponibilidade do URL.' 
    });
  }
};