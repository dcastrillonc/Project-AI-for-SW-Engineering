const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const API_KEY = '46bcefd8a78ce2ca3baf899e4e643cdd';
const BASE_URL = 'https://v3.football.api-sports.io';

app.get('/livescores', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/fixtures`, {
            headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': 'v3.football.api-sports.io'
            },
            params: {
                live: 'all'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
