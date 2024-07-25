import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Avatar, CircularProgress, Container, Button } from '@mui/material';
import { styled } from '@mui/system';
import MatchOddsModal from './MatchOddsModal'; // Import the modal component
import WinLoseBetModal from './WinLoseBetModal';
import ScoreBetModal from './ScoreBetModal';

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

function FetchDataComponent() { //{ sport, league }) {



  const data2 = [
    {
      "fixture": {
          "id": 1158769,
          "referee": null,
          "timezone": "UTC",
          "date": "2024-07-30T00:00:00+00:00",
          "timestamp": 1722297600,
          "periods": {
              "first": null,
              "second": null
          },
          "venue": {
              "id": 45,
              "name": "Estadio Julio César Villagra",
              "city": "Ciudad de Córdoba, Provincia de Córdoba"
          },
          "status": {
              "long": "Not Started",
              "short": "NS",
              "elapsed": null
          }
      },
      "league": {
          "id": 128,
          "name": "Liga Profesional Argentina",
          "country": "Argentina",
          "logo": "https://media.api-sports.io/football/leagues/128.png",
          "flag": "https://media.api-sports.io/flags/ar.svg",
          "season": 2024,
          "round": "2nd Phase - 8"
      },
      "teams": {
          "home": {
              "id": 440,
              "name": "Belgrano Cordoba",
              "logo": "https://media.api-sports.io/football/teams/440.png",
              "winner": null
          },
          "away": {
              "id": 439,
              "name": "Godoy Cruz",
              "logo": "https://media.api-sports.io/football/teams/439.png",
              "winner": null
          }
      },
      "goals": {
          "home": null,
          "away": null
      },
      "score": {
          "halftime": {
              "home": null,
              "away": null
          },
          "fulltime": {
              "home": null,
              "away": null
          },
          "extratime": {
              "home": null,
              "away": null
          },
          "penalty": {
              "home": null,
              "away": null
          }
      },
      "events": [],
      "lineups": [],
      "statistics": [],
      "players": []
  },
  ]


  const [data, setData] = useState(data2);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [winLoseBetMatch, setWinLoseBetMatch] = useState(null);
  const [scoreBetMatch, setScoreBetMatch] = useState(null);

  // useEffect(() => {
  //   if (sport && league && false) {
  //     const fetchData = async () => {
  //       try {
  //         const response = await axios.get(`https://v3.${sport}.api-sports.io/fixtures?league=${league}&season=2024`, {
  //           headers: {
  //             'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
  //             'x-rapidapi-host': `v3.${sport}.api-sports.io`,
  //           },
  //         });
  //         const today = new Date();
  //         const upcomingMatches = response.data.response
  //           .filter(match => new Date(match.fixture.date) >= today)
  //           .sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date))
  //           .slice(0, 10);
  //         setData(upcomingMatches);
  //       } catch (error) {
  //         setError('Error fetching data');
  //         console.error('Error fetching data:', error);
  //       }
  //     };

  //     fetchData();
  //   }
  // }, [sport, league]);

  const handleCardClick = (match) => {
    setSelectedMatch(match);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleWinLoseBetClick = (match) => {
    setWinLoseBetMatch(match);
    setScoreBetMatch(null);
  }

  const handleScoreBetClick = (match) => {
    setScoreBetMatch(match);
    setWinLoseBetMatch(null);
  }

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
          <StyledCard key={fixture.id} /*onClick={() => handleCardClick(match)}*/>
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
              <Grid container spacing={2} alignItems="center" className='mt-3'>
                <Grid item>
                  <Button variant="outlined" onClick={() => handleWinLoseBetClick(match)}>Place WinLose Bet</Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={() => handleScoreBetClick(match)}>Place Score Bet</Button>
                </Grid>
                <Grid item>
                </Grid>
                <Grid item>
                  <Button variant='outlined' onClick={() => handleCardClick(match)}>See ods</Button>
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
      {
        winLoseBetMatch ? <WinLoseBetModal match={winLoseBetMatch} setMatch={setWinLoseBetMatch} /> : <></>
      }
      {
        scoreBetMatch ? <ScoreBetModal match={scoreBetMatch} setMatch={setScoreBetMatch} /> : <></>
      }
    </Container>
  );
}

export default FetchDataComponent;
