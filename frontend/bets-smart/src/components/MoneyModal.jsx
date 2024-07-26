import React, { useState } from 'react';
import { Box, Button, Modal, Typography, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';

export default function MoneyModal( { open, setOpen } ) {
  const [amount, setAmount] = useState(null);

  const handleClose = () => {
    setOpen(false);
  }

    const handleSubmit = () => {
        const amountNum = parseFloat(amount);
        if(!amountNum) {
            alert("Invalid amount");
            return;
        }

        if(amountNum === 0) {
            alert("Amount must not be 0");
            return;
        }

        const transData = {
            amount: amountNum
        };

        fetch("/api/v1/transactions/balance", {
            method: "post",
            body: JSON.stringify(transData),
            headers: new Headers({"Content-Type": "application/json"}),
        }).then(res => {
            if(res.status === 200) {
                alert("Transaction successfull");
                handleClose();
                window.location.reload();
            } else if(res.status === 400) {
                res.json().then(data => {
                    alert(data.message);
                });
            } else {
                alert("An error occured. Please try again");
            }
        })

    };

  return (
    <div>
      <Modal
        open={open}
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
            Add / withdraw money from your account
          </Typography>
          <Typography id="place-bet-modal-desc">
            Type a positive value to add money or a negativa value to withdraw money
          </Typography>
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            id="amount-to-bet"
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Process
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