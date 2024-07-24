
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/Login';
import BetsPage from './pages/BetsPage';

function App() {
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
