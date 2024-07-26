import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Avatar, CircularProgress, Container } from '@mui/material';
import { styled } from '@mui/system';
import MatchOddsModal from './MatchOddsModal'; // Import the modal component

const StyledCard = styled(Card)({
  margin: '20px auto',
  maxWidth: 600,
  cursor: 'pointer', // Add cursor pointer for cards
});

const Logo = styled(Avatar)({
  width: 60,
  height: 60,
});

const TeamName = styled('div')({
  textAlign: 'center',
});

const Score = styled('div')({
  textAlign: 'center',
  fontSize: '1.5em',
  fontWeight: 'bold',
});

const DateText = styled('div')({
  textAlign: 'center',
  fontSize: '1.2em',
});

const Status = styled('div')({
  textAlign: 'center',
  fontSize: '1em',
  marginTop: '10px',
});

function LiveScores() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchLiveMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`https://v3.football.api-sports.io/fixtures?live=all`, {
          headers: {
            'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
            'x-rapidapi-host': 'api.example.com',
          },
        });
        setLiveMatches(response.data.response); // Extract the response array from the response object
      } catch (err) {
        setError('Error fetching live matches');
        console.error('Error fetching live matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatches();
  }, []);

  const handleCardClick = (match) => {
    setSelectedMatch(match);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container>
      {liveMatches.length === 0 ? (
        <Typography>No live matches at the moment.</Typography>
      ) : (
        <Grid container spacing={3}>
          {liveMatches.map(match => {
            const { fixture, teams, goals } = match;
            const date = new Date(fixture.date).toLocaleString();

            return (
              <StyledCard key={fixture.id} onClick={() => handleCardClick(match)}>
                <CardContent>
                  <DateText>
                    {date}
                  </DateText>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={5}>
                      <TeamName>
                        <Logo src={teams.home.logo} alt={teams.home.name} />
                        <Typography variant="h6">{teams.home.name}</Typography>
                      </TeamName>
                    </Grid>
                    <Grid item xs={2}>
                      <Score>
                        {goals.home !== null ? `${goals.home} - ${goals.away}` : '-'}
                      </Score>
                    </Grid>
                    <Grid item xs={5}>
                      <TeamName>
                        <Logo src={teams.away.logo} alt={teams.away.name} />
                        <Typography variant="h6">{teams.away.name}</Typography>
                      </TeamName>
                    </Grid>
                  </Grid>
                  <Status>
                    {fixture.status.long}
                  </Status>
                </CardContent>
              </StyledCard>
            );
          })}
        </Grid>
      )}
      {selectedMatch && (
        <MatchOddsModal
          open={modalOpen}
          handleClose={handleCloseModal}
          match={selectedMatch}
        />
      )}
    </Container>
  );
}

export default LiveScores;
