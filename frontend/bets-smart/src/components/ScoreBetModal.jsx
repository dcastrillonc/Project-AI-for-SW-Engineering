import React, { useState } from 'react';
import { Box, Button, Modal, Typography, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';

export default function ScoreBetModal( { match, setMatch } ) {
  const [amount, setAmount] = useState(null);
  const [homeScore, setHomeScore] = useState(null);
  const [awayScore, setAwayScore] = useState(null);

  const handleClose = () => {
    setMatch(null);
  }

  const handleSubmit = () => {
    const amountNum = parseFloat(amount);
    const homeScoreNum = parseFloat(homeScore);
    const awayScoreNum = parseFloat(awayScore);

    if(!amountNum || amountNum < 1) {
        alert("Invalid amount");
        return;
    }

    if(!homeScoreNum || homeScoreNum < 0) {
        alert("Invalid score");
        return;
    }

    if(!awayScoreNum || awayScoreNum < 0) {
        alert("Invalid score");
        return;
    }

    const betData = {
        fixtureId: match.fixture.id,
        amount: amountNum,
        homeScore: homeScoreNum,
        awayScore: awayScoreNum
    }

    console.log(betData);

    fetch("/api/v1/bets/result", {
        method: "post",
        body: JSON.stringify(betData),
        headers: new Headers({"Content-Type": "application/json"}),
    }).then(res => {
        console.log(res.status);
        if(res.status === 200 || res.status === 201) {
            alert("Bet placed successfully");
            setMatch(null);
        } else if(res.status === 400) {
            res.json().then(data => {
                alert(data.message);
            });
        } else if(res.status === 401 || res.status === 404) {
            alert("You are not logged in. Please login before you bet.");
        } else {
            alert("An error occured when placing the bet. Please try again");
            res.json().then(data => {
                console.log(data);
            });
        }
    });
  };

  return (
    <div>
      <Modal
        open
        onClose={handleClose}
        aria-labelledby="place-bet-modal-title"
        aria-describedby="place-bet-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography id="place-bet-modal-title" variant="h6" component="h2">
            Place Score Bet
          </Typography>
          <Typography id="place-bet-modal-desc">
            Set the bet score
          </Typography>
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            id="amount-to-bet"
            label={match.teams.home.name}
            type="number"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            id="amount-to-bet"
            label={match.teams.away.name}
            type="number"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            id="amount-to-bet"
            label="Amount to bet"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Place Bet
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};