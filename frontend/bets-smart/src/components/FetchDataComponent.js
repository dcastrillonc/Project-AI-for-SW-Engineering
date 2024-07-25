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

function FetchDataComponent({ sport, league }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (sport && league) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`https://v3.${sport}.api-sports.io/fixtures?league=${league}&season=2024`, {
            headers: {
              'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
              'x-rapidapi-host': `v3.${sport}.api-sports.io`,
            },
          });
          const today = new Date();
          const upcomingMatches = response.data.response
            .filter(match => new Date(match.fixture.date) >= today)
            .sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date))
            .slice(0, 10);
          setData(upcomingMatches);
        } catch (error) {
          setError('Error fetching data');
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [sport, league]);

  const handleCardClick = (match) => {
    setSelectedMatch(match);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!data) {
    return <CircularProgress />;
  }

  return (
    <Container>
      {data.map(match => {
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

export default FetchDataComponent;
