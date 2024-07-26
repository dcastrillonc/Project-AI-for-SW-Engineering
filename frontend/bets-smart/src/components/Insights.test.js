// src/InsightsComponent.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import InsightsComponent from './InsightsComponent';
import '@testing-library/jest-dom/extend-expect'; // for the 'toBeInTheDocument' matcher

jest.mock('axios');

describe('InsightsComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner initially', () => {
    render(<InsightsComponent />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders error message on API failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(<InsightsComponent />);

    await waitFor(() => {
      expect(screen.getByText('Error: Network Error')).toBeInTheDocument();
    });
  });

  test('renders no insights available message when response data is empty', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<InsightsComponent />);

    await waitFor(() => {
      expect(screen.getByText('No insights available.')).toBeInTheDocument();
    });
  });

  test('fetches and displays insights data', async () => {
    const insightsData = [
      'This is the first insight.',
      'This is the second insight.',
    ];
    axios.get.mockResolvedValueOnce({ data: insightsData });

    render(<InsightsComponent />);

    await waitFor(() => {
      expect(screen.getByText('Betting Insights')).toBeInTheDocument();
    });

    insightsData.forEach((insight) => {
      expect(screen.getByText(insight)).toBeInTheDocument();
    });
  });

  test('handles unexpected data format', async () => {
    axios.get.mockResolvedValueOnce({ data: 'Unexpected data format' });

    render(<InsightsComponent />);

    await waitFor(() => {
      expect(screen.getByText('Error: Unexpected data format')).toBeInTheDocument();
    });
  });

  test('renders object insights as JSON string', async () => {
    const insightsData = [{ key: 'value' }];
    axios.get.mockResolvedValueOnce({ data: insightsData });

    render(<InsightsComponent />);

    await waitFor(() => {
      expect(screen.getByText('Betting Insights')).toBeInTheDocument();
    });

    expect(screen.getByText(JSON.stringify(insightsData[0]))).toBeInTheDocument();
  });
});
