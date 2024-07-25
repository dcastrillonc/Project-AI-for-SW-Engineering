import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function MatchOddsModal({ open, handleClose, match }) {
  const [odds, setOdds] = useState(null);
  const [bookkeepers, setBookkeepers] = useState([]);
  const [selectedBookkeeper, setSelectedBookkeeper] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match) {
      const fetchOdds = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`https://v3.football.api-sports.io/odds?fixture=${match.fixture.id}`, {
            headers: {
              'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
              'x-rapidapi-host': `v3.football.api-sports.io`,
            },
          });
          setOdds(response.data.response[0]);
          
          setBookkeepers(Array.from(new Set(response.data.response.map(odds => odds.bookmaker.name))));
        } catch (error) {
          console.error('Error fetching odds:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchOdds();
    }
  }, [match]);
  console.log(odds);
  // const filteredOdds = odds?.filter(o => selectedBookkeeper ? o.bookmaker.name === selectedBookkeeper : true);

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
              {bookkeepers.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </TextField>
            {/* {filteredOdds?.map((o) => (
              <Typography key={o.bookmaker.name}>
                {o.bookmaker.name}: {o.odds.map(odd => `${odd.label}: ${odd.value}`).join(', ')}
              </Typography>
            ))} */}
          </>
        )}
        <Button onClick={handleClose}>Close</Button>
      </Box>
    </Modal>
  );
}

export default MatchOddsModal;
