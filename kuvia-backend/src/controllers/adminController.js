const { User, Seller, Store } = require('../models');
const response = require('../utils/response');

exports.getSellerApprovals = async (req, res) => {
  try {
    const sellers = await Seller.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone', 'isActive', 'createdAt']
      }],
      order: [['createdAt', 'DESC']]
    });

    const data = sellers.map((seller) => ({
      id: seller.id,
      userId: seller.userId,
      businessName: seller.businessName || 'Sem nome comercial',
      businessType: seller.businessType || 'OUTROS',
      businessDescription: seller.businessDescription || '',
      whatsapp: seller.whatsapp || '',
      isVerified: seller.isVerified || false,
      verifiedAt: seller.verifiedAt || null,
      createdAt: seller.createdAt,
      user: seller.user ? {
        id: seller.user.id,
        name: seller.user.name,
        email: seller.user.email,
        phone: seller.user.phone,
        isActive: seller.user.isActive,
        createdAt: seller.user.createdAt
      } : null,
      status: seller.isVerified ? 'APPROVED' : 'PENDING'
    }));

    return response.success(res, data, 'Vendedores carregados com sucesso');
  } catch (error) {
    console.error('Erro ao buscar vendedores:', error);
    return response.error(res, 'Erro ao buscar vendedores', 500);
  }
};

exports.updateSellerApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['APPROVED', 'PENDING', 'REJECTED'].includes(status)) {
      return response.error(res, 'Status inválido', 400);
    }

    const seller = await Seller.findByPk(id);

    if (!seller) {
      return response.error(res, 'Vendedor não encontrado', 404);
    }

    const isApproved = status === 'APPROVED';

    // Atualiza o vendedor
    await seller.update({
      isVerified: isApproved,
      verifiedAt: isApproved ? new Date() : null
    });

    // Atualiza a loja associada ao vendedor
    await Store.update(
      {
        status,
        is_active: isApproved
      },
      {
        where: {
          sellerId: seller.id
        }
      }
    );

    return response.success(
      res,
      {
        id: seller.id,
        status
      },
      'Estado atualizado com sucesso'
    );

  } catch (error) {
    console.error('Erro ao atualizar aprovação:', error);
    return response.error(res, 'Erro ao atualizar aprovação', 500);
  }
};