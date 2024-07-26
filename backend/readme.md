# Betsmart API
This API is built using express. To run it, follow these steps:
## Setup
Make sure you have a `.env` file. You can use `.env.example` as a template.

## Running the server
Run the server using 
```shell 
node --env-file .env server.js
```

## API Features
This API features endpoints for:
 - CRUD operations on *user* database
 - Login, logout and password recovery through email
 - Add money and withdraw money from a user's account
 - Placing and consulting placed WinLoseBets.
 - Placing and consulting placed ResultBets.
 - Cashing a bet when the user has won it.

A full documentation of the API was built using postman. Access the collections in [collections folder](collections).<br>
Tests for the User's collection can be found in the [collections folder](collections).