import { Container } from "@mui/system";
import TransactionsList from "../components/transactions/TransactionsList";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import MoneyModal from "../components/MoneyModal";

export default function TransactionsPage(props) {

    const [modalOpen, setModalOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("/api/v1/users").then(res => {
            if(res.status === 200) {
                res.json().then(data => {
                    setUser(data);
                });
            }
        });
    }, []);

    return (
        <>
            <Container>
                <Button variant="outlined" onClick={() => setModalOpen(true)}>Add / withdraw money</Button>
                <div>
                    <h1>Your transactions</h1>
                    { user ? <>
                        <p>Current balance: {user.balance}</p>
                    </> : <></>}
                    <TransactionsList />
                </div>
            </Container>
            <MoneyModal open={modalOpen} setOpen={setModalOpen} />
        </>
    );
}