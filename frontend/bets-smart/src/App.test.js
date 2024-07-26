import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeComponent from './components/HomeComponent';
import Profile from './components/Profile';
import EventsComponent from './components/EventsComponent';
import Insights from './components/Insights';
import LiveScoreDisplay from './components/LiveScore';

// Helper component to test routing
const TestRouter = ({ initialRoute }) => (
  <Router>
    <Routes>
      <Route path="/" element={<HomeComponent />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/events" element={<EventsComponent />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/live_score" element={<LiveScoreDisplay />} />
    </Routes>
  </Router>
);

describe('App Component', () => {
  test('renders HomeComponent for "/" route', () => {
    render(<TestRouter initialRoute="/" />);
    expect(screen.getByText(/Home Component/i)).toBeInTheDocument(); // Adjust to actual text/content
  });

  test('renders Profile for "/profile" route', () => {
    render(<TestRouter initialRoute="/profile" />);
    expect(screen.getByText(/Profile Component/i)).toBeInTheDocument(); // Adjust to actual text/content
  });

  test('renders EventsComponent for "/events" route', () => {
    render(<TestRouter initialRoute="/events" />);
    expect(screen.getByText(/Events Component/i)).toBeInTheDocument(); // Adjust to actual text/content
  });

  test('renders Insights for "/insights" route', () => {
    render(<TestRouter initialRoute="/insights" />);
    expect(screen.getByText(/Insights Component/i)).toBeInTheDocument(); // Adjust to actual text/content
  });

  test('renders LiveScoreDisplay for "/live_score" route', () => {
    render(<TestRouter initialRoute="/live_score" />);
    expect(screen.getByText(/LiveScore Display/i)).toBeInTheDocument(); // Adjust to actual text/content
  });
});
