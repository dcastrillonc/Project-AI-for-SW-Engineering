// src/FetchDataComponent.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FetchDataComponent from './FetchDataComponent';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock MatchOddsModal
jest.mock('./MatchOddsModal', () => {
  return ({ open, handleClose, match }) => (
    <div>
      {open && <div data-testid="modal">Modal for {match.fixture.id}</div>}
      <button onClick={handleClose}>Close Modal</button>
    </div>
  );
});

describe('FetchDataComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner initially', () => {
    render(<FetchDataComponent sport="football" league="1" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders error message on API failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(<FetchDataComponent sport="football" league="1" />);

    expect(await screen.findByText('Error fetching data')).toBeInTheDocument();
  });

  test('fetches and displays match data', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        response: [
          {
            fixture: { id: 1, date: new Date().toISOString(), status: { long: 'Finished' } },
            teams: {
              home: { name: 'Team A', logo: 'logo-a.png' },
              away: { name: 'Team B', logo: 'logo-b.png' },
            },
            goals: { home: 2, away: 1 },
          },
        ],
      },
    });

    render(<FetchDataComponent sport="football" league="1" />);

    // Wait for data to be rendered
    await screen.findByText('Team A');
    expect(screen.getByText('Team B')).toBeInTheDocument();
    expect(screen.getByText('2 - 1')).toBeInTheDocument();
    expect(screen.getByText('Finished')).toBeInTheDocument();
  });

  test('opens and closes the modal on card click', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        response: [
          {
            fixture: { id: 1, date: new Date().toISOString(), status: { long: 'Finished' } },
            teams: {
              home: { name: 'Team A', logo: 'logo-a.png' },
              away: { name: 'Team B', logo: 'logo-b.png' },
            },
            goals: { home: 2, away: 1 },
          },
        ],
      },
    });

    render(<FetchDataComponent sport="football" league="1" />);

    // Wait for data to be rendered
    await screen.findByText('Team A');

    // Click on the card to open the modal
    fireEvent.click(screen.getByText('Team A'));

    // Expect modal to be visible
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    // Close the modal
    fireEvent.click(screen.getByText('Close Modal'));

    // Expect modal to be closed
    await waitFor(() => expect(screen.queryByTestId('modal')).toBeNull());
  });

  test('displays message when no matches are available', async () => {
    axios.get.mockResolvedValueOnce({
      data: { response: [] },
    });

    render(<FetchDataComponent sport="football" league="1" />);

    // Wait for the data to be loaded
    await waitFor(() => expect(screen.queryByText('Team A')).toBeNull());
    expect(screen.queryByText('Finished')).toBeNull();
  });
});
