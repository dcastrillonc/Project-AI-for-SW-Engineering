
import './App.css';
import EventsComponent from './components/EventsComponent';
import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <Header/>
      <Login/>
      <Footer/>
      <EventsComponent/>
    </div>
  );
}

export default App;
