
import { useEffect } from 'react';
import './App.css';
import EventsComponent from './components/EventsComponent';
import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/Login';
import BetsPage from './pages/BetsPage';
import BetDetailPage from './pages/BetDetailPage';
import BetsList from './components/bets-list/BetsList';

function App() {
  useEffect(() => {
    fetch("/api/v1/auth/dummy-login", {method: "post"}).then(res => {
      res.json().then(console.log);
    })
  }, []);
  return (
    <div className="App">
      <Header/>
      {/* <BetsPage /> */}
      {/* <Login/> */}
      {/* <BetDetailPage /> */}
      {/* <BetsPage /> */}
      <Footer/>
      {/* <EventsComponent/> */}
    </div>
  );
}

export default App;
