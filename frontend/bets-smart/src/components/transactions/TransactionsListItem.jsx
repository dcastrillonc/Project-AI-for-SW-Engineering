export default function TransactionsListItem ({ transaction }) {
    const date = new Date(transaction.UTCDate);
    const dateStr = date.toLocaleString();
    const betIdStr = transaction.betId ? transaction.betId : 'N/A';
    return (
        <tr key={transaction._id}>
            <td>{transaction._id}</td>
            <td>{transaction.transactionType}</td>
            <td>{transaction.amount}</td>
            <td>{dateStr}</td>
            <td>{betIdStr}</td>
        </tr>
    )
}