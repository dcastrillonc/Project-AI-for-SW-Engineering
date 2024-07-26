// src/Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import '@testing-library/jest-dom/extend-expect'; // for the 'toBeInTheDocument' matcher

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(<Login />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  test('displays success message on successful login', async () => {
    // Mock the fetch function to return a successful response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve('Login successful'),
      })
    );

    render(<Login />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'testpassword' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText('Log in'));

    await waitFor(() => {
      expect(screen.getByText('Login successful')).toBeInTheDocument();
    });
  });

  test('displays error message on failed login', async () => {
    // Mock the fetch function to return an error response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve('Invalid username or password'),
      })
    );

    render(<Login />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'testpassword' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText('Log in'));

    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
  });

  test('displays error message on network error', async () => {
    // Mock the fetch function to simulate a network error
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    render(<Login />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'testpassword' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText('Log in'));

    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
    });
  });
});
