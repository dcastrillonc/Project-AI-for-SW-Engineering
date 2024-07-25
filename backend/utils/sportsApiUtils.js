var https = require("https");

const LOSE_BET = "lose";
const WIN_BET = "win";
const UNDETERMINED_BET = "undetermined";
const ERROR_BET = "error";

async function getFixtureInfoById(id) {

    const headers = new Headers();
    headers.append("x-rapidapi-host", "v3.football.api-sports.io");
    headers.append("x-rapidapi-key", process.env.SPORTS_API_KEY);

    const response = await fetch(
        `https://v3.football.api-sports.io/fixtures?id=${id}`,
        { headers: headers }
    );
    if(response.status !== 200) {
        throw new Error("Error when fetching football.api-sports.io");
    }

    const resJson = await response.json();

    const fixtureInfo = resJson.response[0];

    if(!fixtureInfo) {
        throw new Error("Fixture not found in reponse");
    }

    return fixtureInfo;
}

/**
 * @returns {LOSE_BET | WIN_BET | UNDETERMINED_BET | ERROR_BET}
 */
function getWinLoseBetStatus(winLoseBet, fixtureInfo) {
    try {
        const fixtureStatus = fixtureInfo.fixture.status.short;
        if(fixtureStatus === "FT" || fixtureStatus === "AET" || fixtureStatus === "PEN") {
            if(winLoseBet.winTeam === "home" && (fixtureInfo.teams.home.winner === true)) {
                return WIN_BET;
            } else if(winLoseBet.winTeam === "away" && (fixtureInfo.teams.away.winner === true)) {
                return WIN_BET;
            } else {
                return LOSE_BET;
            }
        }
        
        return UNDETERMINED_BET;
    } catch(error) {
        console.log(error);
        return ERROR_BET;
    }
}

/**
 * @returns {LOSE_BET | WIN_BET | UNDETERMINED_BET | ERROR_BET}
 */
function getResultBetStatus(resultBet, fixtureInfo) {
    try {
        const fixtureStatus = fixtureInfo.fixture.status.short;
        let homeScore;
        let awayScore;
        if(
            (fixtureStatus === "FT") && 
            typeof fixtureInfo.score.fulltime.home === "number" &&
            typeof fixtureInfo.score.fulltime.away === "number"
        ) {
            homeScore = fixtureInfo.score.fulltime.home;
            awayScore = fixtureInfo.score.fulltime.away;
        } else if(
            (fixtureStatus === "AET") &&
            typeof fixtureInfo.score.extratime.home === "number" &&
            typeof fixtureInfo.score.extratime.away === "number"
        ) {
            homeScore = fixtureInfo.score.extratime.home;
            awayScore = fixtureInfo.score.extratime.away;
        } else if(
            (fixtureStatus === "PEN") &&
            typeof fixtureInfo.score.penalty.home === "number" &&
            typeof fixtureInfo.score.penalty.away === "number"
        ) {
            homeScore = fixtureInfo.score.penalty.home;
            awayScore = fixtureInfo.score.penalty.away;
        }

        if((typeof homeScore === "number") && (typeof awayScore === "number")) {
            if(homeScore === resultBet.homeScore && awayScore === resultBet.awayScore) {
                return WIN_BET
            } else {
                return LOSE_BET
            }
        }
        
        return UNDETERMINED_BET;
    } catch(error) {
        console.log(error);
        return ERROR_BET;
    }
}

module.exports = { 
    LOSE_BET,
    WIN_BET,
    UNDETERMINED_BET,
    ERROR_BET,
    getFixtureInfoById,
    getWinLoseBetStatus,
    getResultBetStatus
};