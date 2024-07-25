const axios = require('axios');
const { getLiveScores } = require('./sportmonks');

test('getLiveScores fetches data correctly', async () => {
  axios.get = jest.fn().mockResolvedValue({ data: { success: true } });
  const response = await getLiveScores();
  expect(response.success).toBe(true);
});
