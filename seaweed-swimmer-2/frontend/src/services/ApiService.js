import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const leaderboardAPI = {
  // Submit score to leaderboard
  submitScore: async (username, score, achievement) => {
    const response = await api.post('/api/leaderboard/submit', {
      username,
      score,
      achievement,
    });
    return response.data;
  },

  // Get global leaderboard
  getGlobalLeaderboard: async (limit = 100) => {
    const response = await api.get(`/api/leaderboard/global?limit=${limit}`);
    return response.data;
  },

  // Check username availability
  checkUsername: async (username) => {
    const response = await api.get(`/api/leaderboard/check-username?username=${encodeURIComponent(username)}`);
    return response.data;
  },

  // Get user rank
  getUserRank: async (username) => {
    const response = await api.get(`/api/leaderboard/rank/${encodeURIComponent(username)}`);
    return response.data;
  },
};

export default api;
