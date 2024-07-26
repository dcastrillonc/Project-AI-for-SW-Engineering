// src/MatchOddsModal.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MatchOddsModal from './MatchOddsModal';

// Mock the axios module
jest.mock('axios');

const mockMatch = {
  fixture: {
    id: 1,
  },
  teams: {
    home: { name: 'Home Team' },
    away: { name: 'Away Team' },
  },
};

const mockOddsResponse = {
  data: {
    response: [
      {
        bookmakers: [
          {
            name: 'Bookkeeper A',
            bets: [
              {
                id: 1,
                name: 'Bet 1',
                values: [
                  { value: 'Outcome 1', odd: 1.5 },
                  { value: 'Outcome 2', odd: 2.5 },
                ],
              },
            ],
          },
          {
            name: 'Bookkeeper B',
            bets: [
              {
                id: 2,
                name: 'Bet 2',
                values: [
                  { value: 'Outcome 3', odd: 1.8 },
                  { value: 'Outcome 4', odd: 2.8 },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

describe('MatchOddsModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading indicator while fetching odds', async () => {
    axios.get.mockResolvedValueOnce(mockOddsResponse);

    render(
      <MatchOddsModal open={true} handleClose={jest.fn()} match={mockMatch} />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  });

  test('displays odds and filters by bookkeeper', async () => {
    axios.get.mockResolvedValueOnce(mockOddsResponse);

    render(
      <MatchOddsModal open={true} handleClose={jest.fn()} match={mockMatch} />
    );

    await waitFor(() => {
      expect(screen.getByText('Odds for Home Team vs Away Team')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByLabelText('Filter by Bookkeeper')).toBeInTheDocument();
    });

    // Check that all bookkeepers are displayed
    fireEvent.change(screen.getByLabelText('Filter by Bookkeeper'), { target: { value: 'Bookkeeper A' } });
    expect(screen.getByText('Bet 1')).toBeInTheDocument();
    expect(screen.getByText('Outcome 1: 1.5')).toBeInTheDocument();
    expect(screen.getByText('Outcome 2: 2.5')).toBeInTheDocument();

    // Change to another bookkeeper
    fireEvent.change(screen.getByLabelText('Filter by Bookkeeper'), { target: { value: 'Bookkeeper B' } });
    expect(screen.getByText('Bet 2')).toBeInTheDocument();
    expect(screen.getByText('Outcome 3: 1.8')).toBeInTheDocument();
    expect(screen.getByText('Outcome 4: 2.8')).toBeInTheDocument();
  });

  test('displays message when no bets available for selected bookmaker', async () => {
    axios.get.mockResolvedValueOnce(mockOddsResponse);

    render(
      <MatchOddsModal open={true} handleClose={jest.fn()} match={mockMatch} />
    );

    await waitFor(() => {
      expect(screen.getByText('Odds for Home Team vs Away Team')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByLabelText('Filter by Bookkeeper')).toBeInTheDocument();
    });

    // Select a bookkeeper that has no bets
    fireEvent.change(screen.getByLabelText('Filter by Bookkeeper'), { target: { value: 'Nonexistent Bookkeeper' } });
    expect(screen.getByText('No bets available for selected bookmaker.')).toBeInTheDocument();
  });

  test('calls handleClose when the Close button is clicked', async () => {
    axios.get.mockResolvedValueOnce(mockOddsResponse);

    const handleClose = jest.fn();

    render(
      <MatchOddsModal open={true} handleClose={handleClose} match={mockMatch} />
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText('Close'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
