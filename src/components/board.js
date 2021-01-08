import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import "fontsource-roboto";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { io } from "socket.io-client";
import "../static/style.css";
import Square from "./square";
import Panel from "./panel.js";
import PawnDialog from "./choose_pawn.js";

const extras = require("./extras.js");

const letters = "abcdefgh";

let socket = io.connect("http://localhost:5000", {
  "sync disconnect on unload": true,
});

function Board(props) {
  const [clicked_square, set_clicked_square] = useState(null);
  const [game_state, set_game_state] = useState(extras.newGame());
  const [next_move, set_next_move] = useState("White");
  // const [check, set_check] = useState(null);
  const [valid_moves, set_valid_moves] = useState([]);
  const [room_id, set_room_id] = useState(null);
  const [color, set_color] = useState(null);
  // Opponent -> 0 == false, 1 == true, 2 == opponent left
  const [opponent, set_opponent] = useState(0);
  // Dialog for if opponent leaves
  const [open, setOpen] = useState(false);
  // end_w and end_b tell the board if a pawn has reached the end
  const [end_w, set_end_w] = useState(null);
  const [end_b, set_end_b] = useState(null);

  useEffect(() => {
    // SOCKET
    socket.on("connect", () => {
      console.log("[SOCKET] Is connected.");
      socket.emit("join");
    });

    socket.on("room-data", (data) => {
      console.log("[SOCKET] Room Data");
      let room_id1 = data["room_id"];
      let color1 = data["color"];
      set_room_id(room_id1);
      set_color(color1);

      console.log("room_id: ", room_id);
      console.log("color: ", color);
    });

    socket.on("opponent", (message) => {
      if (message === "left") {
        set_opponent(2);
        setOpen(true);
      }
    });

    socket.on("full-room", () => {
      set_opponent(1);
    });

    socket.on("message", (data) => {
      console.log(`[SOCKET] Message recieved ${data}`);
    });

    socket.on("move", data => {
      let new_state = JSON.parse(data['JSON_game_state']);
      console.log("[SOCKET] Recieved new game_state. -> ", data);
      // Set game state
      set_game_state(new_state);
      // Set next_move
      set_next_move(data['n_move']);
    });
  });

  useEffect(() => {
    socket.emit("join");
  }, []);

  const getRow = (num) => {
    let row = [];

    for (let i = 0; i <= 7; i++) {
      let tag = letters[i] + num.toString();
      row.push({
        tag: tag,
      });
    }
    return row;
  };

  const getBoardData = () => {
    let board_data = [];
    for (let i = 0; i <= 7; i++) {
      let row = getRow(i + 1);
      board_data.push(row);
    }
    return board_data;
  };

  const getSquareValue = (tag) => {
    // Get i
    let i = tag[1] - 1;

    // Get j
    let j = letters.indexOf(tag[0]);

    let value = game_state[i][j];
    return value;
  };

  const handleClick = (tag) => {
    // Only do anything if it is user's turn to play
    if (next_move === color) {
      /*
          - pawn is the value of previosly chosen square
          - value is the value of second chosen square!
          */

      // coordinates of clicked square
      let coor_x = letters.indexOf(tag[0]);
      let coor_y = tag[1] - 1;

      // Game state
      var local_game_state = [...game_state];
      // Get pawn in the square that is clicked
      const value = local_game_state[coor_y][coor_x];

      // Whose move it is
      let next_move1 = next_move[0].toLowerCase();

      // If no pawn has been chosen in previou click, choose a pawn
      if (clicked_square === null && value !== "" && value[0] === next_move1) {
        // Set clicked_square in state
        // Set valid next moves in state
        set_clicked_square([coor_x, coor_y]);
        const vm = getValidMoves(coor_x, coor_y, value);
        set_valid_moves(v_moves(local_game_state, vm, coor_x, coor_y, value));
      }

      // If pawn was already previously chosen, make a move
      else if (clicked_square !== null) {
        // Get coor of previously chosen pawn
        let pawn_x = clicked_square[0];
        let pawn_y = clicked_square[1];

        // Now get previously chosen pawn value
        let pawn = local_game_state[pawn_y][pawn_x];

        // !!! What to do depends on value on chosen square

        // if chosen pawn and clicked pawn are same color
        if (value[0] === pawn[0]) {
          set_clicked_square([coor_x, coor_y]);
          const vm = getValidMoves(coor_x, coor_y, value);
          set_valid_moves(v_moves(local_game_state, vm, coor_x, coor_y, value));
          } else {
          // If move is valid
          if (extras.check_if_valid_move(coor_x, coor_y, valid_moves)) {
            // Update game state
            local_game_state[coor_y][coor_x] = pawn;
            local_game_state[pawn_y][pawn_x] = "";

            set_game_state(local_game_state);
            set_clicked_square(null);
            set_valid_moves([]);

            // emit new game_state through the socket
            let JSON_game_state = JSON.stringify(local_game_state);
            let n_move = '';
            if (color === 'White') {
              n_move = 'Black';
            } else {
              n_move = 'White';
            }
            socket.emit("move", {
              'JSON_game_state': JSON_game_state, 
              'n_move': n_move
            });
            
            // If move is not valid
          } else {
            set_clicked_square([coor_x, coor_y]);
            const vm = getValidMoves(coor_x, coor_y, value);
            set_valid_moves(v_moves(local_game_state, vm, coor_x, coor_y, value));
          }
        }
      }
    }
  };

  const v_moves = (state, moves, x, y, pawn) => {
    let v_moves = []
    for (let i = 0; i <= moves.length - 1; i++) {
      let state_copy = [...state];
      let move = moves[i];
      let pawn1 = state_copy[move[1]][move[0]];
      let pawn2 = state_copy[y][x];
      state_copy[move[1]][move[0]] = pawn;
      state_copy[y][x] = '';
      let color = 'b';
      if (pawn[0] === 'b') {
        color = 'w';
      }
      let check = checkCheck(state_copy, color);
      if (!check) {
        v_moves.push(move);
      }
      console.log('check: ', check);
      state_copy[move[1]][move[0]] = pawn1;
      state_copy[y][x] = pawn2;      
    }
    return v_moves;
  }

  const getValidMoves = (x, y, pawn) => {
    let valid_moves = [];

    if (pawn[1] === "P") {
      valid_moves = extras.pawn_valid_moves(x, y, pawn, game_state);
    }
    // For a rook
    else if (pawn[1] === "R") {
      valid_moves = extras.rook_valid_moves(x, y, pawn, game_state);
    }
    // For knight
    else if (pawn[1] === "K" && pawn.length > 2) {
      valid_moves = extras.knight_valid_moves(x, y, pawn, game_state);
    } else if (pawn[1] === "K" && pawn.length === 2) {
      valid_moves = extras.king_valid_moves(x, y, pawn, game_state);
    } else if (pawn[1] === "B") {
      valid_moves = extras.get_bishop_moves(x, y, pawn, game_state);
    }
    // Queen
    else if (pawn[1] === "Q") {
      // First get up, down, left, right; just like rook.
      valid_moves = extras.rook_valid_moves(x, y, pawn, game_state);
      let b_moves = extras.get_bishop_moves(x, y, pawn, game_state);
      for (let i = 0; i <= b_moves.length - 1; i++) {
        valid_moves.push(b_moves[i]);
      }
    }
    return valid_moves;
  };

  const checkCheck = (game_state, color) => {
    // Get all valid moves
    // And see if anyone can eat the opponent's king
    for (let i = 0; i <= game_state.length - 1; i++) {
      for (let j = 0; j <= game_state[i].length - 1; j++) {
        let pawn = game_state[i][j];

        if (pawn[0] === color) {
          let valid_moves = getValidMoves(j, i, pawn);
          for (let k = 0; k <= valid_moves.length - 1; k++) {
            if (game_state[valid_moves[k][1]][valid_moves[k][0]] === "wK") {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const getTagsOfValidMoves = (valid_moves) => {
    let tags = [];
    if (valid_moves.length > 0) {
      for (let i = 0; i <= valid_moves.length - 1; i++) {
        console.log('move: ', valid_moves[i]);
        let move = valid_moves[i];
        let y = (move[1] + 1).toString();
        let x = letters[move[0]];
        let tag = x + y;
        tags.push(tag);
      }
      console.log('Tags: ', tags);
    }
    return tags;
  }

  const switchPawn = (x, y, pawn) => {
    console.log(x, y, pawn);
    let updated_game_state = game_state;
    updated_game_state[y][x] = pawn;
    set_game_state(updated_game_state);
    set_end_b(null);
    set_end_w(null);
  };

  const handleExit = () => {
    socket.emit("leave", {
      room_id: room_id,
    });
  };

  const handleFindNewGame = () => {
    socket.emit("leave", {
      room_id: room_id,
    });
    set_opponent(0);
    socket.emit("join");
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Set the board
  let board_data = getBoardData();

  // Waiting on opponent
  if (opponent === 0) {
    return (
      <div className="game">
        <div className="waiting">
          <Typography variant="h5" component="h5" gutterBottom>
            Searching for an opponent...
          </Typography>
          <CircularProgress mode="indeterminate" color="#ffffff" />
        </div>
      </div>
    );
  }
  // Opponent found
  else {
    return (
      <div className="game">
        {end_w ? (
          <PawnDialog
            color={"w"}
            open={true}
            switchPawn={switchPawn}
            data={end_w}
          />
        ) : null}
        {end_b ? (
          <PawnDialog
            color={"b"}
            open={true}
            switchPawn={switchPawn}
            data={end_b}
          />
        ) : null}
        {opponent === 2 ? (
          <div className="dialog">
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              className="dialog-dialog"
            >
              <DialogTitle id="alert-dialog-title">
                {"Your opponent has left the game."}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Would you like to find a new game or exit?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    handleFindNewGame();
                  }}
                  color="primary"
                >
                  Find a New Game
                </Button>
                <Button 
                onClick={handleExit} 
                component={Link}
                to={'/'}
                color="primary" 
                autoFocus>
                  Exit
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        ) : null}
        <Panel
          set_game_state={set_game_state}
          set_next_move={set_next_move}
          handleExit={handleExit}
          color={color}
          next_move={next_move}
          online={true}
        />
        <div className="board">
          <div className="squares">
            {board_data.map((row) => {
              return (
                <div className="board-row">
                  {row.map((square) => {
                    return (
                      <Square
                        tag={square.tag}
                        value={getSquareValue(square.tag)}
                        handleClick={handleClick}
                        validMoves={getTagsOfValidMoves(valid_moves)}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Board;
