import { useEffect, useState } from "react"
import BetsListItem from "./BetsListItem";

/**
 * 
 * @param {{type: "winlose" | "result"}} props 
 * @returns 
 */
export default function BetsList({ type }) {
    const [winLoseBets, setWinLoseBets] = useState(null);
    useEffect(() => {
        if(type === "winlose") {
            fetch("/api/v1/bets/winlose", {method: "get"}).then(res => {
                if(res.status === 401 || res.status === 404) {
                    window.location.href = "/login";
                } else if(res.status === 200) {
                    res.json().then(resJson => {
                        setWinLoseBets(resJson);
                    });
                } else {
                    alert("An error occurred while fetching bets");
                }
            });
        } else {
            fetch("/api/v1/bets/result", {method: "get"}).then(res => {
                if(res.status === 401 || res.status === 404) {
                    window.location.href = "/login";
                } else if(res.status === 200) {
                    res.json().then(resJson => {
                        setWinLoseBets(resJson);
                    });
                } else {
                    alert("An error occurred while fetching bets");
                }
            });
        }
    }, []);
    if(!winLoseBets){
        return (<p>Loading...</p>)
    }
    if(winLoseBets && winLoseBets.length === 0) {
        return(<p>No bets to display.</p>)
    }
    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Placement Date</th>
                        <th>Match</th>
                        <th>Your bet</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {winLoseBets.map(bet => {
                        return <BetsListItem bet={bet} type={type} />
                    })}
                </tbody>
            </table>
        </div>
    )
}