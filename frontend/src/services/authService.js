import api from './api';

export const authService = {
  /**
   * Register a new user
   * @param {Object} data { name, email, password, role, preferredLanguage }
   */
  signup: async (data) => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },

  /**
   * Log in user
   * @param {Object} credentials { email, password }
   */
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  /**
   * Fetch current authenticated user's profile
   */
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  /**
   * Log out user
   */
  logout: async () => {
    try {
      const response = await api.get('/api/auth/logout');
      return response.data;
    } catch {
      // Even if network fails, logout should clear client state
      return { success: true };
    }
  },
};

export default authService;

