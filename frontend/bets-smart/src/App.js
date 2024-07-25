import { useEffect } from 'react';
import './App.css';
import EventsComponent from './components/EventsComponent';
import Footer from './components/Footer';
import Header from './components/Header';
import HomeComponent from './components/HomeComponent';
import Profile from './components/Profile';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import BetsPage from './pages/BetsPage';
import TransactionsPage from './pages/TransactionsPage';
import BetDetailPage from './pages/BetDetailPage';

function App() {
  // useEffect(() => {
    // fetch("/api/v1/auth/dummy-login", {method: "post"}).then(res => {
    //   res.json().then(console.log);
    // })
  // }, []);
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events" element={<EventsComponent />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path='/bets' element={<BetsPage />} />
          <Route path='/bets/winlose/*' element={<BetDetailPage />} />
          <Route path='/bets/result/*' element={<BetDetailPage />} />
          <Route path='/transactions' element={<TransactionsPage />} />
          {/* <Route path="/bets" element={<Bets />} />
          <Route path="/insights" element={<Insights />} /> */}
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
