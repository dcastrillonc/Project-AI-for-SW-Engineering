import React from 'react';
import Container from '@mui/material/Container';
import ResponsiveAppBar from './ResponsiveAppBar';

export default function Header() {
  return (
    <Container sx={{ padding: '50px' }}>
      <ResponsiveAppBar/>
    </Container>
  );
}
