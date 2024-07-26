import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '80vh', // Maximum height for the modal content
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto', // Enable vertical scrolling
};

function MatchOddsModal({ open, handleClose, match }) {
  const [odds, setOdds] = useState([]);
  const [bookkeepers, setBookkeepers] = useState([]);
  const [selectedBookkeeper, setSelectedBookkeeper] = useState('');
  const [selectedBookkeeperOdds, setSelectedBookkeeperOdds] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match) {
      const fetchOdds = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`https://v3.football.api-sports.io/odds?fixture=${match.fixture.id}`, {
            headers: {
              'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
              'x-rapidapi-host': 'v3.football.api-sports.io',
            },
          });
          const oddsData = response.data.response[0];
          setOdds(oddsData.bookmakers);
          setBookkeepers([...new Set(oddsData.bookmakers.map((bk) => bk.name))]);
        } catch (error) {
          console.error('Error fetching odds:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchOdds();
    }
  }, [match]);

  useEffect(() => {
    if (selectedBookkeeper) {
      const bookmakerOdds = odds.find((o) => o.name === selectedBookkeeper);
      setSelectedBookkeeperOdds(bookmakerOdds);
    } else {
      setSelectedBookkeeperOdds(null);
    }
  }, [selectedBookkeeper, odds]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          Odds for {match?.teams.home.name} vs {match?.teams.away.name}
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              select
              label="Filter by Bookkeeper"
              fullWidth
              margin="normal"
              value={selectedBookkeeper}
              onChange={(e) => setSelectedBookkeeper(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">All Bookkeepers</option>
              {bookkeepers.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </TextField>
            {selectedBookkeeperOdds ? (
              <div>
                {selectedBookkeeperOdds.bets.map((bet) => (
                  <div key={bet.id}>
                    <Typography variant="subtitle1">{bet.name}</Typography>
                    {bet.values.map((value) => (
                      <Typography key={value.value}>
                        {value.value}: {value.odd}
                      </Typography>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <Typography>No bets available for selected bookmaker.</Typography>
            )}
          </>
        )}
        <Button onClick={handleClose}>Close</Button>
      </Box>
    </Modal>
  );
}

export default MatchOddsModal;
