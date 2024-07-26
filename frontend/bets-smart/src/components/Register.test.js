import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Register from './Register';

describe('Register Component', () => {
  test('renders Register component', () => {
    render(<Register />);
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  test('renders input fields and submit button', () => {
    render(<Register />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  test('updates input fields correctly', () => {
    render(<Register />);
    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john.doe@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('calls handleSubmit on form submit', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<Register />);
    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Register/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    expect(consoleSpy).toHaveBeenCalledWith('name: John Doe, email: john.doe@example.com, password: password123');
    consoleSpy.mockRestore();
  });
});
