import api from './api';

export const userService = {
  /**
   * Get user by ID
   * @param {string} id
   */
  getUser: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  /**
   * Update user details (name, email)
   * @param {string} id
   * @param {Object} data
   */
  updateUser: async (id, data) => {
    const response = await api.put(`/api/users/${id}`, data);
    return response.data;
  },

  /**
   * Update preferred language for user
   * @param {string} id
   * @param {string} preferredLanguage ('en' | 'te' | 'hi' | 'ta' | 'kn')
   */
  updateLanguage: async (id, preferredLanguage) => {
    const response = await api.patch(`/api/users/${id}/language`, { preferredLanguage });
    return response.data;
  },
};

export default userService;

