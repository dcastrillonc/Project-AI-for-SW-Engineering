import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress, Typography } from '@mui/material';

const EditProfile = ({ open, handleClose, userData, setUserData }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userData) {
      setFormData({ name: userData.name, email: userData.email });
    }
  }, [userData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Update the user data
      const response = await axios.put('/api/v1/users', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserData(response.data);
      handleClose();
    } catch (err) {
      setError('Error updating profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        {loading ? <CircularProgress /> : (
          <>
            {error && <Typography color="error">{error}</Typography>}
            <TextField
              margin="normal"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="normal"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfile;
