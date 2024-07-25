import { Container } from "@mui/system";
import { useEffect, useState } from "react";

export default function BetDetailPage() {
    const [bet, setBet] = useState(null);
    const [fixtureInfo, setFixtureInfo] = useState(null);
    const [betStatus, setBetStatus] = useState(null);
    const [type, setType] = useState(null);
    useEffect(() => {
        let url = window.location.pathname;
        url = url.replace(/^\/+/, "");
        url = url.replace(/\/+$/, "");
        const urlParts = url.split("/");
        if(urlParts.length !== 3) {
            alert("BAD REQUEST: Invalid URL");
        }

        const type = urlParts[1];
        const betId = urlParts[2];
        if(type !== "winlose" && type !== "result") {
            alert("BAD REQUEST: Invalid URL");
        }
        
        const fetchUrl = "/api/v1/bets/" + type + "/" + betId;

        fetch(fetchUrl).then(res => {
            res.json().then(resJson => {
                if(res.status === 200) {
                    console.log(resJson);
                    setBet(resJson.bet);
                    setFixtureInfo(resJson.fixtureInfo);
                    setBetStatus(resJson.status);
                    setType(type);
                } else {
                    alert("An error occured when fetching the bet information");
                }
            });
        });
    }, []);

    if(!bet) return (<p>Loading...</p>);
    const matchStr = bet.homeTeamName + " vs. " + bet.awayTeamName;
    const date = new Date(bet.UTCDate);
    const dateStr = date.toLocaleString("es-CO");
    let betStatusStr = "Bet status is not yet available. Either the match has not ended, or we are still " + 
        "processing the results. Come back later!";

    if(betStatus === "win") {
        betStatusStr = "You won! You can now cash your bet";
    } else if(betStatus === "lose") {
        betStatusStr = "You lost this time. Good luck on your coming bets!";
    } else if(betStatus === "error") {
        betStatusStr = "We encountered an error when processing your bet status. Please contact us."
    }

    let yourBet;
    if(type === "winlose") {
        yourBet = (bet.winTeam === "home")? bet.homeTeamName : bet.awayTeamName;
        yourBet += " wins";
    } else {
        yourBet = "Score: " + bet.homeTeamName + " " +  bet.homeScore + " - " + bet.awayScore + " " + bet.awayTeamName; 
    }
    return (
        <Container>
            <h1>Your bet</h1>
            <p>Bet ID: {bet._id}</p>
            <p>Bet Placement Date: {dateStr}</p>
            <p>Yout bet: {yourBet}</p>
            <p>Bet status: {betStatusStr}</p>
            <h2>Match information</h2>
            <p>Match: {matchStr}</p>
            { fixtureInfo ? (
                <>
                    <p>Match date: {fixtureInfo.fixture.date}</p>
                    <p>Match status: {fixtureInfo.fixture.status.long}</p>
                </>
                
            ) : <></> }
            <p></p>
        </Container>
    )
}