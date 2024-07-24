
import { useEffect } from 'react';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/Login';
import BetsPage from './pages/BetsPage';

function App() {
  // useEffect(() => {
  //   fetch("/api/v1/auth/dummy-login", {method: "post"}).then(res => {
  //     res.json().then(console.log);
  //   })
  // }, []);
  return (
    <div className="App">
      <Header/>
      <BetsPage />
      {/* <Login/> */}
      <Footer/>
    </div>
  );
}

export default App;
