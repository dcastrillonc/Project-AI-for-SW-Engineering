import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LiveScoreDisplay = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const { data } = await axios.get('/api/live-scores');
        setScores(data.data); // Ajusta esto según la estructura de respuesta de SportMonks
      } catch (error) {
        console.error('Error fetching live scores:', error);
      }
    };

    const intervalId = setInterval(fetchScores, 60000); // Refrescar cada 60 segundos
    fetchScores(); // Fetch inicial al cargar el componente

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {scores.map((score) => (
        <div key={score.id}>
          {score.localteam.name} vs {score.visitorteam.name}: {score.scores.localteam_score} - {score.scores.visitorteam_score}
        </div>
      ))}
    </div>
  );
};

export default LiveScoreDisplay;
