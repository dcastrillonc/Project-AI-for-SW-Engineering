import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CircularProgress, Container, Button } from '@mui/material';
import { styled } from '@mui/system';
import EditProfile from './EditProfile';

const StyledCard = styled(Card)({
  margin: '20px auto',
  maxWidth: 600,
});

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/v1/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUserData(response.data);
      } catch (err) {
        setError('Error fetching user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!userData) {
    return null;
  }

  return (
    <Container>
      <StyledCard>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            User Profile
          </Typography>
          <Typography variant="body1"><strong>Name:</strong> {userData.name}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {userData.email}</Typography>
          <Typography variant="body1"><strong>Account Balance:</strong> ${userData.accountBalance}</Typography>
          <Button variant="contained" color="primary" onClick={handleEditOpen}>
            Edit Profile
          </Button>
        </CardContent>
      </StyledCard>
      <EditProfile
        open={editOpen}
        handleClose={handleEditClose}
        userData={userData}
        setUserData={setUserData}
      />
    </Container>
  );
};

export default UserProfile;
