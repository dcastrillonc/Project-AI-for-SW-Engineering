import { useState } from "react"
import BetsList from "../components/bets-list/BetsList"
import { Container } from "@mui/material"

export default function BetsPage(props) {
    return (
        <Container>
            <h1>Your Bets</h1>
            <h2>Win-Lose Bets</h2>
            <BetsList type="winlose" />
            <h2>Result Bets</h2>
            <BetsList type="result" />
        </Container>
    )
}