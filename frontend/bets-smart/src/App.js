import './App.css';
import EventsComponent from './components/EventsComponent';
import Footer from './components/Footer';
import Header from './components/Header';
import HomeComponent from './components/HomeComponent';
import Profile from './components/Profile';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
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
