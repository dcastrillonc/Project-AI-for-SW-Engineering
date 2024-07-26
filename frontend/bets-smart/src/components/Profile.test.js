// src/UserProfile.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import UserProfile from './Profile';

// Mock the axios module
jest.mock('axios');

// Mock EditProfile component
jest.mock('./EditProfile', () => ({ open, handleClose, userData, setUserData }) => (
  <div data-testid="edit-profile">
    {open && (
      <>
        <h2>Edit Profile</h2>
        <button onClick={handleClose}>Close</button>
      </>
    )}
  </div>
));

const mockUserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  accountBalance: 1000,
};

describe('UserProfile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'dummy-token');
  });

  test('displays loading indicator while fetching user data', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUserData });

    render(<UserProfile />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  });

  test('displays user data after fetching', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUserData });

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText('User Profile')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Name: John Doe')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Email: john.doe@example.com')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Account Balance: $1000')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit Profile' })).toBeInTheDocument();
    });
  });

  test('displays error message if fetching user data fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error fetching user data'));

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText('Error fetching user data')).toBeInTheDocument();
    });
  });

  test('opens EditProfile modal when Edit Profile button is clicked', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUserData });

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit Profile' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));

    expect(screen.getByTestId('edit-profile')).toBeInTheDocument();
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  test('closes EditProfile modal when Close button is clicked', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUserData });

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit Profile' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));

    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByText('Edit Profile')).not.toBeInTheDocument();
  });
});
