/**
 * 
 * @param {{
 *  bet: {
 *      userId: string,
        * fixtureId: number,
        * amount: number,
        * homeTeamName: string,
        * awayTeamName: string,
        * winTeam: "home" | "away" | undefined,
        * homeScore: number | undefined,
        * awayScore: number | undefined,
        * payed: boolean,
        * _id: string,
        * UTCDate: string,
        * __v: number
 *  },
 *  type: "winlose" | "result"
 * }} props 
 * @returns 
 */
export default function BetsListItem({ bet, type }) {
    const date = new Date(bet.UTCDate);
    const dateStr = date.toLocaleString("es-CO");
    const match = bet.homeTeamName + " vs. " + bet.awayTeamName;
    let yourBet;
    let detailUrl = "/bets";
    if(type === "winlose") {
        yourBet = (bet.winTeam === "home")? bet.homeTeamName : bet.awayTeamName;
        yourBet += " wins";
        detailUrl += "/winlose/" + bet._id;
    } else {
        yourBet = "Score: " + bet.homeScore + "-" + bet.awayScore; 
        detailUrl += "/result/" + bet._id;
    }
    return (
        // <a href={`/bets/${bet._id}`}>
            <tr>
                <td>{dateStr}</td>
                <td>{match}</td>
                <td>{yourBet}</td>
                <td>${bet.amount}</td>
                <td>{bet.payed ? "Cashed" : "Not Cashed"}</td>
                <td><a href={detailUrl}>Details</a></td>
            </tr>
        // </a>
    )
}