import { useEffect, useState } from "react";
import TransactionsListItem from "./TransactionsListItem";

export default function TransactionsList(props) {
    const [transactions, setTransactions] = useState(null);

    useEffect(() => {
        fetch("/api/v1/transactions").then(res => {
            if(res.status === 200) {
                res.json().then(data => {
                    setTransactions(data);
                });
            } else if(res.status === 404 || res.status === 401) {
                window.location.href = "/login";
            } else {
                alert("Error loading transactions");
            }
        });
    }, []);

    if(!transactions) {
        return <p>Loading...</p>;
    }

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Bet ID</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((transaction) => (
                    <TransactionsListItem key={transaction.id} transaction={transaction} />
                ))}
            </tbody>
        </table>
    )
}