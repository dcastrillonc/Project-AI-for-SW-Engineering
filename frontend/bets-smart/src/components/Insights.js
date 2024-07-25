import React, { useState, useEffect } from 'react';
import { Container, CircularProgress, Typography, Box } from '@mui/material';
import axios from 'axios';

const InsightsComponent = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get('/api/insights'); // Ensure the correct API endpoint
        // Ensure the response data is an array
        if (Array.isArray(response.data)) {
          setInsights(response.data);
        } else {
          throw new Error('Unexpected data format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <Container
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <CircularProgress color="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Typography variant="h5" color="error">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  if (insights.length === 0) {
    return (
      <Container
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Typography variant="h5">No insights available.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Betting Insights</Typography>
        {insights.map((insight, index) => (
          <Box key={index} sx={{ mt: 4 }}>
            <Typography variant="h5">Summary</Typography>
            <Typography variant="body1">
              {typeof insight === 'object' ? JSON.stringify(insight) : insight}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default InsightsComponent;
