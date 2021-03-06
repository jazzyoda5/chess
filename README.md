Online Multiplayer Chess Game

Demo: http://www.coolchess.xyz/
 - username: test
 - password: test

This is the React - client-side - portion of the code
Server-side code is here -> https://github.com/jazzyoda5/chess-server
---

 - An online Chess game that has a Singleplayer and a Multiplayer mode.
 - Chess logic is implemented on the frontend.
 - A chess engine that uses the Minimax algorithm to determine which move to make is 
 implemented on the backend in Python.
 - It uses flask_socketio library to transmit moves between opponents.

![Screenshot](https://github.com/jazzyoda5/chess-client/blob/master/src/static/imgs/Screenshot%202021-03-01%20at%2023.32.31.png?raw=true)
![Screenshot](https://github.com/jazzyoda5/chess-client/blob/master/src/static/imgs/Screenshot%202021-03-01%20at%2023.33.43.png?raw=true)

---
PLAN

Board will be a separate component
Each square on the board will be a separate component

Board is 8x8, left white rook is a1 and is on a
dark square.

White pawns = [
    wR, wK, wB, wQ, wKn
]
Black pawns = [
    bR, bK, bB, bQ, bKn
]

When playing against the computer, the front end will
calculate all possible moves and socket that to the server.
Then a python script will deteremine which move to make and coket that back.
All that is left is to update the game_state.


---

Rules to keep track of:

0. Check
->
Get possible moves for all apponoents pieces
and see if the king is in possible eaten valid moves

1. How pieces move
2. Castling {
    - If king moves castling is no more possible
    - If a rook moves, castling is not possible on that side
    - There can't be any pieces between the king and the rook
    - The king is not in check
}
3. When the game is won {
    - Checkmate -> When there is no legal move
    to escape check.
    - Resignation
    Win on time (Will make a timer?)
}
4. When the game is a draw {
    - Stalemate
    - Threefold repetition
    - Fifty-move Rules
    - Dead position

}
5. En passant -> When a pawn makes a two-step move
from it's starting position.
6. Promotion -> Pawn can change to any other chosen figure
when it reaches the opposite end of the board 

---

Bugs:
