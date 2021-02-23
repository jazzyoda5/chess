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
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../static/style.css";
import Square from "./square";
import Panel from "./panel.js";
import PawnDialog from "./choose_pawn.js";
import CheckmateDialog from "./checkmate_dialog";
import { socket } from '../socket/socket';

const extras = require("./extras.js");

const letters = "abcdefgh";

// Multiplayer game
function Board(props) {
  const [clicked_square, set_clicked_square] = useState(null);
  const [game_state, set_game_state] = useState(extras.newGame());
  const [next_move, set_next_move] = useState("White");
  const [check, set_check] = useState(null);
  const [valid_moves, set_valid_moves] = useState([]);
  const [room_id, _set_room_id] = useState(null);
  const [color, set_color] = useState(null);
  // Opponent -> 0 == false, 1 == true, 2 == opponent left
  const [opponent, set_opponent] = useState(0);
  // Dialog for if opponent leaves
  const [open, setOpen] = useState(false);
  // end_w and end_b tell the board if a pawn has reached the end
  const [end_w, set_end_w] = useState(null);
  const [end_b, set_end_b] = useState(null);
  // This solves an error that occured when finding valid_moves after castling
  // So after a user has castled, it doesn't try to see, if castling is still possible
  const [already_castled, set_castled] = useState(false);
  const [checkmate, set_checkmate] = useState(false);


  // To avoid being stranded if opponent
  // Closes browser window mid game
  // Handle function is on the bottom
  // Of the file
  const roomIdRef = useRef(room_id);
  const set_room_id = (data) => {
    roomIdRef.current = data;
    _set_room_id(data);
  };

  // Run only once to join the game
  useEffect(() => {
    console.log("[SOCKET] Joining a game.");
    socket.emit("join");

    // SOCKET
    socket.on("connect", () => {
      console.log("[SOCKET] Is connected.");
    });

    // If opponent is found
    // Or if he left
    socket.on("opponent", (message) => {
      console.log("[SOCKET] Opponent found.");

      if (message === "left") {
        set_opponent(2);
        setOpen(true);
      }
    });

    // Game can begin
    socket.on("full-room", () => {
      set_opponent(1);
    });

    socket.on("move", (data) => {
      let new_state = JSON.parse(data["JSON_game_state"]);
      // Set game state
      set_game_state(new_state);
      // Set next_move
      set_next_move(data["n_move"]);
      set_check(data["check"]);
    });

    // When you joing a game you recieve data about the game
    socket.on("room-data", (data) => {
      let room_id1 = data["room_id"];
      let color1 = data["color"];
      set_room_id(room_id1);
      set_color(color1);
    });

    socket.on("message", (data) => {
      console.log(`[SOCKET] Message recieved ${data}`);
    });

    socket.on('checkmate', (data) => {
      set_game_state(data['game_state']);
      set_checkmate(data['checkmate']);
    })
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
      var local_game_state = JSON.parse(JSON.stringify(game_state));
      // Get pawn in the square that is clicked
      const value = local_game_state[coor_y][coor_x];

      // Whose move it is
      let next_move1 = next_move[0].toLowerCase();

      // If no pawn has been chosen in previou click, choose a pawn
      if (clicked_square === null && value !== "" && value[0] === next_move1) {
        // Set clicked_square in state
        // Set valid next moves in state
        const vm = getValidMoves(coor_x, coor_y, value, local_game_state);
        console.log("vm", vm);

        set_clicked_square([coor_x, coor_y]);
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
          const vm = getValidMoves(coor_x, coor_y, value, local_game_state);
          console.log("vm", vm);

          // If clicked pawn is your playing color than get valid moves
          // This if statement fixes some bugs where
          // You could move other player's pawns
          if (value[0] === color[0].toLowerCase()) {
            set_valid_moves(v_moves(local_game_state, vm, coor_x, coor_y, value));
          } else {
            set_valid_moves([]);
          }
        } else {
          // If move is valid
          if (extras.check_if_valid_move(coor_x, coor_y, valid_moves)) {
            /* If the previous move checked the opponent
              opponent must make sure his next move
              unchecks his king
          */
            // Check if it is a pawn that reached the end
            // Of the board
            let n_move = "";
            if (color === "White") {
              n_move = "Black";
            } else {
              n_move = "White";
            }

            // Check if castling
            const castling = extras.check_if_castling(
              coor_x,
              coor_y,
              pawn_x,
              pawn_y,
              pawn,
              local_game_state
            );
            console.log(castling);
            if (castling !== false) {
              /*
              Castling is handled by a different
              method than making a move
              */
              handleCastling(castling, local_game_state, n_move);
              return;
            }

            if (pawn === "wP" && coor_y === 0) {
              set_end_w([
                coor_x,
                coor_y,
                pawn_x,
                pawn_y,
                "wP",
                n_move,
                next_move1,
              ]);
              return;
            }
            if (pawn === "bP" && coor_y === 7) {
              set_end_b([coor_x, coor_y, "bP"]);
              return;
            }

            makeMove(
              coor_x,
              coor_y,
              pawn_x,
              pawn_y,
              pawn,
              local_game_state,
              n_move,
              next_move1
            );

            // If move is not valid
          } else {
            set_clicked_square([coor_x, coor_y]);
            const vm = getValidMoves(coor_x, coor_y, value, local_game_state);
            if (value[0] === color[0].toLowerCase()) {
              set_valid_moves(
                v_moves(local_game_state, vm, coor_x, coor_y, value)
              );
            } else {
              set_valid_moves([]);
            }
          }
        }
      }
    }
  };

  const makeMove = (
    x,
    y,
    pawn_x,
    pawn_y,
    pawn,
    local_game_state,
    n_move,
    next_move1
  ) => {
    // Check variable
    /* 
    I will emit checks to avoid bugs -> Sometime when users 
    has check state null and the other one doesn't
    */
    var check = null;
    // figure out next move
    /*
    Every time there is a check, I will check for checkmate.
    */

    set_clicked_square(null);
    set_valid_moves([]);
    set_game_state(
      updateGameState(x, y, pawn_x, pawn_y, pawn, local_game_state)
    );

    if (next_move1 === "w") {
      // White moved, check check on black
      if (
        checkCheck(
          updateGameState(x, y, pawn_x, pawn_y, pawn, local_game_state),
          "w"
        )
      ) {
        handleCheck("b", x, y, pawn_x, pawn_y, pawn, local_game_state);
        check = "b";
      }
    } else {
      // Black moved, check check on white
      if (
        checkCheck(
          updateGameState(x, y, pawn_x, pawn_y, pawn, local_game_state),
          "b"
        )
      ) {
        handleCheck("w", x, y, pawn_x, pawn_y, pawn, local_game_state);
        check = "w";
      }
    }

    // emit new game_state through the socket
    let JSON_game_state = JSON.stringify(local_game_state);
    socket.emit("move", {
      JSON_game_state: JSON_game_state,
      n_move: n_move,
      check: check,
      room_id: room_id 
    });
  };

  const handleCastling = (type, state, n_move) => {
    if (type === "wR") {
      state[7][4] = "";
      state[7][5] = "wR";
      state[7][6] = "wK";
      state[7][7] = "";
    } else if (type === "wL") {
      state[7][4] = "";
      state[7][3] = "wR";
      state[7][2] = "wK";
      state[7][1] = "";
      state[7][0] = "";
    } else if (type === "bR") {
      state[0][4] = "";
      state[0][5] = "bR";
      state[0][6] = "bK";
      state[0][7] = "";
    } else if (type === "bL") {
      state[0][4] = "";
      state[0][3] = "bR";
      state[0][2] = "bK";
      state[0][1] = "";
      state[0][0] = "";
    }

    set_clicked_square(null);
    set_valid_moves([]);
    set_castled(true);
    set_game_state(state);
    // emit new game_state through the socket
    let JSON_game_state = JSON.stringify(state);
    socket.emit("move", {
      JSON_game_state: JSON_game_state,
      n_move: n_move,
      check: check,
      room_id: room_id
    });
  };

  // This valid moves function is to avoid putting
  // Your own pieces in check and aking it so
  // That you have to get out of check with if
  // Your king is checked
  const v_moves = (state, moves, x, y, pawn) => {
    let v_moves = [];

    if (color[0].toLowerCase() !== pawn[0]) {
      return v_moves;
    }

    if (pawn[0] === color[0].toLowerCase()) {
      for (let i = 0; i <= moves.length - 1; i++) {
        let state_copy = JSON.parse(JSON.stringify(state));
        let move = moves[i];
        state_copy[move[1]][move[0]] = pawn;
        state_copy[y][x] = "";
        let color = "b";
        if (pawn[0] === "b") {
          color = "w";
        }
        let check = checkCheck(state_copy, color);
        if (!check) {
          v_moves.push(move);
        }
      }
    }
    return v_moves;
  };

  const getValidMoves = (
    x,
    y,
    pawn,
    local_game_state,
    checking_check = false
  ) => {
    let valid_moves = [];

    if (pawn[1] === "P") {
      valid_moves = extras.pawn_valid_moves(x, y, pawn, local_game_state);
    }
    // For a rook
    else if (pawn[1] === "R") {
      valid_moves = extras.rook_valid_moves(x, y, pawn, local_game_state);
    }
    // For knight
    else if (pawn[1] === "K" && pawn.length > 2) {
      valid_moves = extras.knight_valid_moves(x, y, pawn, local_game_state);
    } else if (pawn[1] === "K" && pawn.length === 2) {
      valid_moves = extras.king_valid_moves(x, y, pawn, local_game_state);
      const c_move = extras.castling_possible(x, y, pawn, local_game_state);
      if (c_move !== false && !checking_check && !already_castled && c_move !== undefined) {
        valid_moves.push(c_move);
      }
    } else if (pawn[1] === "B") {
      valid_moves = extras.get_bishop_moves(x, y, pawn, local_game_state);
    }
    // Queen
    else if (pawn[1] === "Q") {
      // First get up, down, left, right; just like rook.
      valid_moves = extras.rook_valid_moves(x, y, pawn, local_game_state);
      let b_moves = extras.get_bishop_moves(x, y, pawn, local_game_state);
      for (let i = 0; i <= b_moves.length - 1; i++) {
        valid_moves.push(b_moves[i]);
      }
    }
    return valid_moves;
  };

  const checkCheck = (igame_state, color) => {
    // Get all valid moves
    // And see if anyone can eat the opponent's king
    for (let i = 0; i <= igame_state.length - 1; i++) {
      for (let j = 0; j <= igame_state[i].length - 1; j++) {
        let pawn = igame_state[i][j];

        if (pawn[0] === color) {
          let valid_moves = getValidMoves(j, i, pawn, igame_state, true);
          for (let k = 0; k <= valid_moves.length - 1; k++) {
            let pawn_on_pos = igame_state[valid_moves[k][1]][valid_moves[k][0]];
            if (pawn_on_pos[1] === "K" && pawn_on_pos.length === 2) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const checkCheckmate = (state, color) => {
    console.log('checkmate state: ', state);

    // Get all moves and if there are no possible moves
    // It is checkmate
    let valid_moves1 = [];
    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        let pawn = state[i][j];
        if (pawn[0] === color) {
          const vm = getValidMoves(j, i, pawn, state);
          let moves = v_moves(state, vm, j, i, pawn);
          if (moves.length > 0) {
            for (let x = 0; x <= moves.length - 1; x++) {
              valid_moves1.push(moves[x]);
            }
          }
        }
      }
    }
    if (valid_moves1.length < 1) {
      if (color === 'w') {
        return 'Black';
      } else {
        return 'White';
      }
    }
    console.log('c_move checkmate: ', valid_moves1);
    return false;
  };

  // Makes a move and returns a new version of game_state
  const updateGameState = (
    coor_x,
    coor_y,
    pawn_x,
    pawn_y,
    pawn,
    l_game_state
  ) => {
    l_game_state[coor_y][coor_x] = pawn;
    l_game_state[pawn_y][pawn_x] = "";
    return l_game_state;
  };

  const handleCheck = (given_color, x, y, pawn_x, pawn_y, pawn, lg_state) => {
    // color = Color of the king that is in danger
    set_check(given_color);

    // Check for checkmate
    let mate = checkCheckmate(lg_state, given_color);

    // If checkmate
    if (mate !== false) {
      set_checkmate(mate);
      socket.emit('checkmate', {
        'game_state': lg_state,
        'checkmate': mate,
        'room_id': room_id
      });
      // Emit checkmate
    }
  };

  /*
  When valid moves are calculated
  This function finds the tags of those moves
  so it can feed it to <Square />
  */
  const getTagsOfValidMoves = (valid_moves) => {
    let tags = [];
    if (valid_moves.length > 0) {
      for (let i = 0; i <= valid_moves.length - 1; i++) {
        let move = valid_moves[i];
        let y = (move[1] + 1).toString();
        let x = letters[move[0]];
        let tag = x + y;
        tags.push(tag);
      }
    }
    return tags;
  };

  /*
  This function switches the pawn
  for whatever the user chooses 
  after a pawn reaches the end of the board
  */
  const switchPawn = (x, y, pawn_x, pawn_y, pawn, next_move1) => {
    let n_move = "";
    if (color === "White") {
      n_move = "Black";
    } else {
      n_move = "White";
    }
    let local_game_state = JSON.parse(JSON.stringify(game_state));
    makeMove(x, y, pawn_x, pawn_y, pawn, local_game_state, n_move, next_move1);
    set_end_b(null);
    set_end_w(null);
  };

  const handleExit = () => {
    socket.emit("leave", {
      room_id: room_id,
    });
    // reset component
    set_room_id(null);
    set_color(null);
    set_checkmate(false);
    set_check(null);
    set_castled(false);
    set_next_move('White');
    set_game_state(extras.newGame());
  };

  const handleUnload = (event) => {
    event.preventDefault();
    event.returnValue = " ";
    socket.emit("leave", {
      room_id: roomIdRef.current,
    });
  }

  // Handles closing the browser window
  useEffect(() => {
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    }
  }, []);

  useEffect(() => {
    window.onpopstate = () => {
      socket.emit('leave', {
        'room_id': roomIdRef.current,
      })
      // reset component
      set_room_id(null);
      set_color(null);
      set_checkmate(false);
      set_check(null);
      set_castled(false);
      set_next_move('White');
      set_game_state(extras.newGame());
    };
  }, [])

  const handleFindNewGame = () => {
    socket.emit("leave", {
      room_id: room_id,
    });
    // No opponent
    set_opponent(0);

    // reset component
    set_room_id(null);
    set_color(null);
    set_checkmate(false);
    set_check(null);
    set_castled(false);
    set_next_move('White');
    set_game_state(extras.newGame());

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
                  to={"/"}
                  color="primary"
                  autoFocus
                >
                  Exit
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        ) : null}
        {checkmate !== false ? (
          <CheckmateDialog
            open={true}
            winner={checkmate}
            handleExit={handleExit}
          />
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
                        check={check}
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
