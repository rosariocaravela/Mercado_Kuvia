import api from './api';

export const adminService = {
  getSellerApprovals: async () => {
    const response = await api.get('/admin/sellers');
    return response.data;
  },
  updateSellerApproval: async (sellerId, status) => {
    const response = await api.put(`/admin/sellers/${sellerId}/approval`, { status });
    return response.data;
  }
};

export default adminService;
