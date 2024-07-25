import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import FetchDataComponent from "./FetchDataComponent";

const sports = [
  "football",
  /*"afl",
  "baseball",
  "basketball",
  "formula-1",
  "handball",
  "hockey",
  "mma",
  "nba",
  "nfl",
  "rugby",
  "volleyball",*/
];

function EventsComponent() {
  const [sport, setSport] = useState("");
  const [country, setCountry] = useState("");
  const [league, setLeague] = useState("");
  const [countries, setCountries] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingLeagues, setLoadingLeagues] = useState(false);
  const [errorCountries, setErrorCountries] = useState(null);
  const [errorLeagues, setErrorLeagues] = useState(null);
  const [submitted, setSubmitted] = useState(true);

  useEffect(() => {
    if (sport) {
      const fetchCountries = async () => {
        setLoadingCountries(true);
        setErrorCountries(null);
        try {
          const response = await axios.get(`https://v3.${sport}.api-sports.io/countries`, {
            headers: {
              "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
              "x-rapidapi-host": `v3.${sport}.api-sports.io`,
            },
          });
          setCountries(response.data.response);
        } catch (err) {
          setErrorCountries("Error fetching countries");
          console.error("Error fetching countries:", err);
        } finally {
          setLoadingCountries(false);
        }
      };
      fetchCountries();
    }
  }, [sport]);

  useEffect(() => {
    if (country && sport) {
      const fetchLeagues = async () => {
        setLoadingLeagues(true);
        setErrorLeagues(null);
        try {
          const response = await axios.get(`https://v3.${sport}.api-sports.io/leagues?country=${country}`, {
            headers: {
              "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
              "x-rapidapi-host": `v3.${sport}.api-sports.io`,
            },
          });
          setLeagues(response.data.response);
        } catch (err) {
          setErrorLeagues("Error fetching leagues");
          console.error("Error fetching leagues:", err);
        } finally {
          setLoadingLeagues(false);
        }
      };
      fetchLeagues();
    }
  }, [country, sport]);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Select Sport, Country, and League
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Sport</InputLabel>
        <Select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          label="Sport"
        >
          {sports.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal" disabled={!sport}>
        <InputLabel>Country</InputLabel>
        <Select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          label="Country"
        >
          {loadingCountries && <CircularProgress />}
          {errorCountries && <MenuItem disabled>{errorCountries}</MenuItem>}
          {countries.map((c) => (
            <MenuItem key={c.name} value={c.name}>
              <ListItemIcon>
                <img
                  src={c.flag}
                  alt={`${c.name} flag`}
                  style={{ width: 24, height: 16, marginRight: 8 }}
                />
              </ListItemIcon>
              <ListItemText primary={c.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal" disabled={!country}>
        <InputLabel>League</InputLabel>
        <Select
          value={league}
          onChange={(e) => setLeague(e.target.value)}
          label="League"
        >
          {loadingLeagues && <CircularProgress />}
          {errorLeagues && <MenuItem disabled>{errorLeagues}</MenuItem>}
          {leagues.map((l) => (
            <MenuItem key={l.league.id} value={l.league.id}>
              {l.league.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!sport || !country || !league}
      >
        Show Next 10 Events
      </Button>
      {submitted && <FetchDataComponent sport={sport} league={league} />}
    </Container>
  );
}

export default EventsComponent;
