import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import EditProfile from './EditProfile';

jest.mock('axios');

describe('EditProfile Component', () => {
  const handleClose = jest.fn();
  const setUserData = jest.fn();

  test('renders EditProfile component', () => {
    render(
      <EditProfile
        open={true}
        handleClose={handleClose}
        userData={{ name: 'John Doe', email: 'johndoe@example.com' }}
        setUserData={setUserData}
      />
    );

    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('updates form data on input change', () => {
    render(
      <EditProfile
        open={true}
        handleClose={handleClose}
        userData={{ name: 'John Doe', email: 'johndoe@example.com' }}
        setUserData={setUserData}
      />
    );

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');

    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    fireEvent.change(emailInput, { target: { value: 'janesmith@example.com' } });

    expect(nameInput.value).toBe('Jane Smith');
    expect(emailInput.value).toBe('janesmith@example.com');
  });

  test('submits form data and updates user data', async () => {
    const mockResponse = { data: { name: 'Jane Smith', email: 'janesmith@example.com' } };
    axios.put.mockResolvedValue(mockResponse);

    render(
      <EditProfile
        open={true}
        handleClose={handleClose}
        userData={{ name: 'John Doe', email: 'johndoe@example.com' }}
        setUserData={setUserData}
      />
    );

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const saveButton = screen.getByText('Save');

    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    fireEvent.change(emailInput, { target: { value: 'janesmith@example.com' } });

    fireEvent.click(saveButton);

    expect(axios.put).toHaveBeenCalledWith('/api/v1/users', { name: 'Jane Smith', email: 'janesmith@example.com' }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    await waitFor(() => {
      expect(setUserData).toHaveBeenCalledWith(mockResponse.data);
    });
    
    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
    });
  });

  test('displays error message on profile update failure', async () => {
    const errorMessage = 'Error updating profile';
    axios.put.mockRejectedValue(new Error(errorMessage));

    render(
      <EditProfile
        open={true}
        handleClose={handleClose}
        userData={{ name: 'John Doe', email: 'johndoe@example.com' }}
        setUserData={setUserData}
      />
    );

    const saveButton = screen.getByText('Save');

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(setUserData).not.toHaveBeenCalled();
    });
    
    await waitFor(() => {
      expect(handleClose).not.toHaveBeenCalled();
    });
  });
});