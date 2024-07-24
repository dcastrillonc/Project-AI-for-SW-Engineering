import React from 'react';
import ReactiveAppBar from './ReactiveAppBar.js';
import Container from '@mui/material/Container';

export default function Header() {
  return (
    <Container sx={{ padding: '50px' }}>
      <ReactiveAppBar />
    </Container>
  );
}
