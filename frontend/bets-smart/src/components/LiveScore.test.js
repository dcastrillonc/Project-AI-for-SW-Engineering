// src/LiveScoreDisplay.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import LiveScoreDisplay from './LiveScoreDisplay';
import '@testing-library/jest-dom/extend-expect'; // for the 'toBeInTheDocument' matcher

jest.mock('axios');

describe('LiveScoreDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays live scores', async () => {
    const mockScores = {
      data: [
        {
          id: 1,
          localteam: { name: 'Team A' },
          visitorteam: { name: 'Team B' },
          scores: { localteam_score: 1, visitorteam_score: 2 },
        },
        {
          id: 2,
          localteam: { name: 'Team C' },
          visitorteam: { name: 'Team D' },
          scores: { localteam_score: 3, visitorteam_score: 4 },
        },
      ],
    };

    axios.get.mockResolvedValueOnce({ data: mockScores });

    render(<LiveScoreDisplay />);

    await waitFor(() => {
      expect(screen.getByText('Team A vs Team B: 1 - 2')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Team C vs Team D: 3 - 4')).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(<LiveScoreDisplay />);

    await waitFor(() => {
      expect(screen.queryByText('Error fetching live scores:')).not.toBeInTheDocument();
    });

    // Ensures no data is rendered when there is an error
    expect(screen.queryByText(/vs/)).not.toBeInTheDocument();
  });

  test('updates scores every 60 seconds', async () => {
    jest.useFakeTimers();

    const initialScores = {
      data: [
        {
          id: 1,
          localteam: { name: 'Team A' },
          visitorteam: { name: 'Team B' },
          scores: { localteam_score: 1, visitorteam_score: 2 },
        },
      ],
    };

    const updatedScores = {
      data: [
        {
          id: 1,
          localteam: { name: 'Team A' },
          visitorteam: { name: 'Team B' },
          scores: { localteam_score: 2, visitorteam_score: 2 },
        },
      ],
    };

    axios.get.mockResolvedValueOnce({ data: initialScores }).mockResolvedValueOnce({ data: updatedScores });

    render(<LiveScoreDisplay />);

    await waitFor(() => {
      expect(screen.getByText('Team A vs Team B: 1 - 2')).toBeInTheDocument();
    });

    // Fast-forward 60 seconds
    jest.advanceTimersByTime(60000);

    await waitFor(() => {
      expect(screen.getByText('Team A vs Team B: 2 - 2')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
