import React from 'react'

const Profile = ({ user }) => {
  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user.email}</p>
      <p>Name: {user.name}</p>
      <p>Balance: {user.balance}</p>
      <p>Bet Statistics:</p>
      <ul>
        <li>Total Bets: {user.totalBets}</li>
        <li>Winning Bets: {user.winningBets}</li>
        <li>Losing Bets: {user.losingBets}</li>
      </ul>
      <h2>Last 5 Placed Bets</h2>
      {user.bets.slice(0, 5).map((bet, index) => (
        <div key={index}>
          <p>Bet ID: {bet.id}</p>
          <p>Prediction: {bet.prediction}</p>
          <p>Amount: {bet.amount}</p>
          <p>Result: {bet.result}</p>
        </div>
      ))}
    </div>
  )
}

export default Profile
