import { useEffect } from 'react';
import './App.css';
import EventsComponent from './components/EventsComponent';
import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/Login';
import BetsPage from './pages/BetsPage';
import BetDetailPage from './pages/BetDetailPage';
import BetsList from './components/bets-list/BetsList';
import HomeComponent from './components/HomeComponent';
import Profile from './components/Profile';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  useEffect(() => {
    fetch("/api/v1/auth/dummy-login", {method: "post"}).then(res => {
      res.json().then(console.log);
    })
  }, []);
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events" element={<EventsComponent />} />
          {/* <Route path="/bets" element={<Bets />} />
          <Route path="/insights" element={<Insights />} /> */}
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
