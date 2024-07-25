const axios = require('axios');

const API_KEY = process.env.SPORTMONKS_API_KEY; // API key almacenada en las variables de entorno
const BASE_URL = process.env.SPORTMONKS_BASE_URL; // URL base de la API de SportMonks

/**
 * Fetch live scores from the SportMonks API
 */
const getLiveScores = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/livescores`, {
      params: {
        api_token: API_KEY,
        include: 'team,league'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch live scores:', error);
    throw error;
  }
};

module.exports = { getLiveScores };
