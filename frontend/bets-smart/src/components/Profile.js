import React, { useEffect, useState } from 'react'

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/v1/users").then(res => {
      if(res.status === 200) {
        res.json().then(data => setUser(data));
      } else if(res.status === 401 || res.status === 404) {
        window.location.href = "/login";
      } else {
        alert("An error occured when fetching user information");
      }
    });
  }, []);

  if(!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user.email}</p>
      <p>Name: {user.name}</p>
      <p>Balance: {user.balance}</p>
    </div>
  )
}

export default Profile
