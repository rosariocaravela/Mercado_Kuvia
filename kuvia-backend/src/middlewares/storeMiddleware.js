const Store = require('../models/Store');
const { Op } = require('sequelize');

/**
 * Middleware: Verifica se loja existe e está activa/aprovada
 * Adiciona a loja a `req.store` para uso nos controllers
 * Uso: Em rotas públicas como GET /stores/:slug
 */
exports.checkStoreActive = async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Slug da loja é obrigatório e deve ser texto.' 
      });
    }

    const store = await Store.findOne({ 
      where: { 
        slug: slug.toLowerCase(),
        is_active: true, 
        status: 'APPROVED' 
      },
      attributes: ['id', 'slug', 'name', 'description', 'whatsapp_number', 'logo_url', 'banner_url', 'theme_config']
    });

    if (!store) {
      // Diferenciar: loja não existe vs loja não aprovada
      const exists = await Store.findOne({ where: { slug: slug.toLowerCase() } });
      
      if (!exists) {
        return res.status(404).json({ 
          success: false, 
          message: 'Loja não encontrada. Verifique o URL e tente novamente.' 
        });
      } else {
        return res.status(403).json({ 
          success: false, 
          message: 'Esta loja está em análise ou temporariamente indisponível.' 
        });
      }
    }

    req.store = store;
    next();
  } catch (error) {
    console.error('❌ Erro no middleware checkStoreActive:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno ao verificar disponibilidade da loja.' 
    });
  }
};

/**
 * Middleware: Verifica se o utilizador é dono da loja
 * Uso: Em rotas protegidas como PUT /stores/:id (apenas dono pode editar)
 */
exports.checkStoreOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Autenticação necessária para esta operação.' 
      });
    }

    const store = await Store.findOne({ 
      where: { id },
      include: [{ model: require('../models/Seller'), as: 'owner', attributes: ['userId'] }]
    });

    if (!store) {
      return res.status(404).json({ 
        success: false, 
        message: 'Loja não encontrada.' 
      });
    }

    if (store.owner?.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Apenas o dono da loja pode realizar esta acção.' 
      });
    }

    req.store = store;
    next();
  } catch (error) {
    console.error('❌ Erro no middleware checkStoreOwnership:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao verificar permissões da loja.' 
    });
  }
};

/**
 * Middleware: Valida disponibilidade de slug (para registo/actualização)
 * Uso: GET /stores/check-slug?slug=nome-da-loja
 */
exports.validateSlugAvailability = async (req, res, next) => {
  try {
    const { slug } = req.query;
    
    if (!slug) {
      return res.status(400).json({ 
        success: false, 
        message: 'Parâmetro "slug" é obrigatório.' 
      });
    }

    // Validar formato do slug
    const isValidFormat = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.toLowerCase());
    if (!isValidFormat) {
      return res.status(400).json({ 
        success: false, 
        message: 'Slug inválido. Use apenas letras minúsculas, números e hífens.' 
      });
    }

    // Verificar se já existe (excluindo a própria loja se for update)
    const where = { slug: slug.toLowerCase() };
    if (req.params?.id) {
      where.id = { [Op.ne]: req.params.id }; // Excluir a loja actual na validação
    }
    
    const exists = await Store.findOne({ where });
    
    res.json({ 
      success: true, 
      available: !exists,
      message: exists ? 'Este URL já está em uso. Tente outro nome.' : 'URL disponível!' 
    });
  } catch (error) {
    console.error('❌ Erro ao validar slug:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao verificar disponibilidade do URL.' 
    });
  }
};