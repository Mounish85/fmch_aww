import api from './api';

export const beneficiaryService = {
  /**
   * Get all beneficiaries
   */
  getBeneficiaries: async () => {
    const response = await api.get('/api/beneficiaries');
    return response.data;
  },

  /**
   * Get single beneficiary by ID
   * @param {string} id
   */
  getBeneficiaryById: async (id) => {
    const response = await api.get(`/api/beneficiaries/${id}`);
    return response.data;
  },

  /**
   * Create a new beneficiary
   * @param {Object} data { name, age, contactNumber, address }
   */
  createBeneficiary: async (data) => {
    const response = await api.post('/api/beneficiaries', data);
    return response.data;
  },

  /**
   * Update beneficiary
   * @param {string} id
   * @param {Object} data { name, age, contactNumber, address }
   */
  updateBeneficiary: async (id, data) => {
    const response = await api.put(`/api/beneficiaries/${id}`, data);
    return response.data;
  },

  /**
   * Delete beneficiary
   * @param {string} id
   */
  deleteBeneficiary: async (id) => {
    const response = await api.delete(`/api/beneficiaries/${id}`);
    return response.data;
  },
};

export default beneficiaryService;

