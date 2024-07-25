import React, { useState } from 'react';
import { Box, Button, Modal, Typography, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';

export default function WinLoseBetModal( { match, setMatch } ) {
  const [team, setTeam] = useState(null);
  const [amount, setAmount] = useState(null);

  const handleClose = () => {
    setMatch(null);
  }

  const handleSubmit = () => {
    console.log(team);

    const amountNum = parseFloat(amount);

    if(!team) {
        alert("Please select a team to bet");
        return;
    }

    if(!amountNum || amountNum < 1) {
        alert("Invalid amount");
        return;
    }

    let winTeam;

    if(team === "home") {
        winTeam = "home";
    } else if (team === "away") {
        winTeam = "away";
    } else {
        alert("Inavlid winTeam");
        return;
    }

    const betData = {
        fixtureId: match.fixture.id,
        amount: amountNum,
        winTeam: winTeam
    }

    fetch("/api/v1/bets/winlose", {
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
            Place Win Lose Bet
          </Typography>
          <Typography id="place-bet-modal-desc">
            Select the team that will win
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="bet-select-label">Team</InputLabel>
            <Select
              labelId="bet-select-label"
              id="bet-select"
              value={team}
              label="Team"
              onChange={(e) => setTeam(e.target.value)}
            >
              <MenuItem value="home">{match.teams.home.name}</MenuItem>
              <MenuItem value="away">{match.teams.away.name}</MenuItem>
            </Select>
          </FormControl>
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