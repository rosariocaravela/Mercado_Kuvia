const { validationResult } = require('express-validator');
const storeService = require('../services/storeService');
const Store = require('../models/Store');
const Seller = require('../models/Seller');

// =====================================================
// ➕ CRIAR LOJA
// =====================================================
exports.createStore = async (req, res) => {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 RECEBENDO PEDIDO DE CRIAÇÃO DE LOJA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Utilizador:', req.user?.id, req.user?.role);
    console.log('📦 Body recebido:', req.body);
    console.log('🖼️  Ficheiros recebidos:', req.files);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       console.log('❌ Erros de validação:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => ({
          field: e.param,
          message: e.msg
        }))
      });
    }

    if (req.user?.role !== 'SELLER') {
      return res.status(403).json({
        success: false,
        message: 'Apenas vendedores podem criar lojas.'
      });
    }

    const seller = await Seller.findOne({
      where: { userId: req.user.id }
    });

    if (!seller) {
      return res.status(400).json({
        success: false,
        message: 'Perfil de vendedor não encontrado.'
      });
    }

    const store = await storeService.createStore(
      seller.id,
      req.body,
      req.files
    );

    console.log('✅ LOJA CRIADA COM SUCESSO!');
    console.log('Loja ID:', store.id);
    console.log('Logo URL:', store.logo_url);
    console.log('Banner URL:', store.banner_url);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return res.status(201).json({
      success: true,
      message: 'Loja criada com sucesso!',
      data: store
    });
  } catch (error) {
    console.error('❌ createStore error:', error);
     console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERRO AO CRIAR LOJA');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return res.status(500).json({
      success: false,
      message: error.message || 'Erro ao criar loja.',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// =====================================================
// 🧾 LOJA DO VENDEDOR ATUAL
// =====================================================
exports.getMyStore = async (req, res) => {
  try {
    if (req.user?.role !== 'SELLER') {
      return res.status(403).json({
        success: false,
        message: 'Apenas vendedores podem aceder à loja.'
      });
    }

    const seller = await Seller.findOne({ where: { userId: req.user.id } });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de vendedor não encontrado.'
      });
    }

    const store = await storeService.getStoreBySeller(seller.id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Loja não encontrada para este vendedor.'
      });
    }

    return res.json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('❌ getMyStore error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao carregar loja do vendedor.'
    });
  }
};

// =====================================================
// 🏪 LOJA PÚBLICA
// =====================================================
exports.getStoreBySlug = async (req, res) => {
  try {
    const store = req.store;

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Loja não encontrada.'
      });
    }

    return res.json({
      success: true,
      data: store
    });

  } catch (error) {
    console.error('❌ getStoreBySlug error:', error);

    return res.status(500).json({
      success: false,
      message: 'Erro ao carregar loja.'
    });
  }
};

// =====================================================
// 📦 PRODUTOS DA LOJA
// =====================================================
exports.getStoreProducts = async (req, res) => {
  try {
    const result = await storeService.getStoreProducts(
      req.store.id,
      req.query
    );

    return res.json({
      success: true,
      data: result,
      meta: {
        store: {
          name: req.store.name,
          slug: req.store.slug
        }
      }
    });

  } catch (error) {
    console.error('❌ getStoreProducts error:', error);

    return res.status(500).json({
      success: false,
      message: 'Erro ao carregar produtos.'
    });
  }
};

// =====================================================
// � ATUALIZAR LOJA
// =====================================================
exports.updateStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => ({
          field: e.param,
          message: e.msg
        }))
      });
    }

    const storeId = req.params.id;
    const updates = req.body;

    const updatedStore = await storeService.updateStore(
      storeId,
      updates,
      req.files
    );

    return res.json({
      success: true,
      message: 'Loja atualizada com sucesso.',
      data: updatedStore
    });
  } catch (error) {
    console.error('❌ updateStore error:', error);

    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar loja.'
    });
  }
};

// =====================================================
// �🔍 SEARCH STORES
// =====================================================
exports.searchStores = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => ({
          field: e.param,
          message: e.msg
        }))
      });
    }

    const result = await storeService.searchStores(req.query);

    return res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ searchStores error:', error);

    return res.status(500).json({
      success: false,
      message: 'Erro ao pesquisar lojas.'
    });
  }
};

// =====================================================
// ⚡ CHECK SLUG (CORRIGIDO)
// =====================================================
exports.checkSlug = async (req, res) => {
  try {
    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({
        success: false,
        available: false,
        message: 'Slug obrigatório'
      });
    }

    const store = await Store.findOne({
      where: { slug: slug.toLowerCase() }
    });

    return res.json({
      success: true,
      available: !store,
      message: !store
        ? 'Slug disponível'
        : 'Slug já está em uso'
    });

  } catch (error) {
    console.error('❌ checkSlug error:', error);

    return res.status(500).json({
      success: false,
      available: false,
      message: 'Erro ao verificar slug.'
    });
  }
};