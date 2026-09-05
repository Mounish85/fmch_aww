import api from './api';

export const counsellingService = {
  /**
   * Create counselling record (triggers backend call to ML service & NLLB translation)
   * @param {Object} data { beneficiary, conductedBy, inputs }
   */
  createCounselling: async (data) => {
    const response = await api.post('/api/counselling', data);
    return response.data;
  },

  /**
   * Get all counselling records
   */
  getCounsellings: async () => {
    const response = await api.get('/api/counselling');
    return response.data;
  },

  /**
   * Get counselling record by ID
   * @param {string} id
   */
  getCounsellingById: async (id) => {
    const response = await api.get(`/api/counselling/${id}`);
    return response.data;
  },

  /**
   * Update counselling record
   * @param {string} id
   * @param {Object} data
   */
  updateCounselling: async (id, data) => {
    const response = await api.put(`/api/counselling/${id}`, data);
    return response.data;
  },

  /**
   * Translate recommendation into another language
   * @param {Object} data { recommendation, targetLanguage, sourceLanguage }
   */
  translateRecommendation: async (recommendation, targetLanguage, sourceLanguage = 'en') => {
    const response = await api.post('/api/translate', {
      recommendation:
        typeof recommendation === 'object' && recommendation !== null
          ? recommendation
          : { title: 'Guidance', message: String(recommendation) },
      source_language: sourceLanguage,
      target_language: targetLanguage,
    });
    return response.data;
  },
};

export default counsellingService;

