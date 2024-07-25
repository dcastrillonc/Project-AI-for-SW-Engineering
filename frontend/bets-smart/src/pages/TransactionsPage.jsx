import TransactionsList from "../components/transactions/TransactionsList";

export default function TransactionsPage(props) {
    return (
        <div>
            <h1>Your transactions</h1>
            <TransactionsList />
        </div>
    );
}