import { Button, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import "fontsource-roboto";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "../static/style.css";
import Square from "./square";

const letters = "abcdefgh";

let socket = io.connect("http://localhost:5000");

// Returns a fresh game_state list
const newGame = () => {
  let new_game = [];

  // Tags for pawns
  var b_pawns = ["bR", "bKn", "bB", "bQ", "bK", "bB", "bKn", "bR"];
  var w_pawns = ["wR", "wKn", "wB", "wQ", "wK", "wB", "wKn", "wR"];

  // Num of squares on whole board

  for (let i = 0; i <= 7; i++) {
    new_game.push([]);

    for (let j = 0; j <= 7; j++) {
      if (i === 0) {
        new_game[i].push({});
        new_game[i][j] = b_pawns[j];
      } else if (i === 1) {
        new_game[i].push({});
        new_game[i][j] = "bP";
      } else if (i === 6) {
        new_game[i].push({});
        new_game[i][j] = "wP";
      } else if (i === 7) {
        new_game[i].push({});
        new_game[i][j] = w_pawns[j];
      } else {
        new_game[i].push({});
        new_game[i][j] = "";
      }
    }
  }

  return new_game;
};

function Board(props) {
  const [clicked_square, set_clicked_square] = useState(null);
  const [game_state, set_game_state] = useState(newGame());
  const [next_move, set_next_move] = useState("White");
  // const [check, set_check] = useState(null);
  const [valid_moves, set_valid_moves] = useState(null);
  const [connection, set_connection] = useState(false);
  const [room_id, set_room_id] = useState(null);
  const [color, set_color] = useState(null);

  useEffect(() => {
    // SOCKET
    socket.on("connect", () => {
      console.log("[SOCKET] Is connected.");
      socket.emit('join');
    });

    socket.on('room-data', data => {
      console.log('[SOCKET] Room Data');
      let room_id1 = data['room_id'];
      let color1 = data['color'];
      set_room_id(room_id1);
      set_color(color1);

      console.log('room_id: ', room_id);
      console.log('color: ', color);
    });

    socket.on('full-room', () => {
      set_connection(true);
    })

    socket.on('message', data => {
      console.log(`[SOCKET] Message recieved ${data}`)
    });

    socket.on("move", (JSON_new_state) => {
      let new_state = JSON.parse(JSON_new_state);
      console.log("[SOCKET] Recieved new game_state. -> ", new_state);
      // Set game state
      set_game_state(new_state);
      // Set next_move
      if (next_move === "White") {
        set_next_move("Black");
      } else {
        set_next_move("White");
      }
    });


    console.log("[USE EFFECT] Complete.");
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
    /*
        - pawn is the value of previosly chosen square
        - value is the value of second chosen square!
        */

    // coordinates of clicked square
    let coor_x = letters.indexOf(tag[0]);
    let coor_y = tag[1] - 1;

    // Game state
    var local_game_state = game_state;
    // Get pawn in the square that is clicked
    const value = local_game_state[coor_y][coor_x];

    // Whose move it is
    let next_move1 = next_move[0].toLowerCase();

    // If no pawn has been chosen in previou click, choose a pawn
    if (clicked_square === null && value !== "" && value[0] === next_move1) {
      // Set clicked_square in state
      // Set valid next moves in state
      set_clicked_square([coor_x, coor_y]);
      set_valid_moves(getValidMoves(coor_x, coor_y, value));
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
        set_valid_moves(getValidMoves(coor_x, coor_y, value));
      } else {
        // If move is valid
        if (check_if_valid_move(coor_x, coor_y, valid_moves)) {
          // Update game state
          local_game_state[coor_y][coor_x] = pawn;
          local_game_state[pawn_y][pawn_x] = "";

          // figure out next move
          if (next_move1 === "w") {
            // White moved, check check on black
            if (checkCheck(game_state, "w")) {
              console.log("check2");
            }
            set_next_move("Black");
          } else {
            // Black moved, check check on white
            if (checkCheck(game_state, "b")) {
              console.log("check1");
            }
            set_next_move("White");
          }
          set_game_state(local_game_state);
          set_clicked_square(null);

          // emit new game_state through the socket
          let JSON_game_state = JSON.stringify(local_game_state);
          socket.emit("move", JSON_game_state);

          console.log("JSON Game State: ", JSON_game_state);

          // If move is not valid
        } else {
          set_clicked_square([coor_x, coor_y]);
          set_valid_moves(getValidMoves(coor_x, coor_y, value));
        }
      }
    }
  };

  const getValidMoves = (x, y, pawn) => {
    let valid_moves = [];

    if (pawn[1] === "P") {
      // White pawn
      if (pawn[0] === "w") {
        if (y === 6) {
          if (game_state[y - 2][x] === "") {
            valid_moves.push([x, y - 2]);
          }
        }
        if (game_state[y - 1][x] === "") {
          valid_moves.push([x, y - 1]);
        }
        if (x !== 0 && game_state[y - 1][x - 1][0] === "b") {
          valid_moves.push([x - 1, y - 1]);
        }
        if (x !== 7 && game_state[y - 1][x + 1][0] === "b") {
          valid_moves.push([x + 1, y - 1]);
        }
      } else if (pawn[0] === "b") {
        if (y === 1) {
          if (game_state[y + 2][x] === "") {
            valid_moves.push([x, y + 2]);
          }
        }
        if (game_state[y + 1][x] === "") {
          valid_moves.push([x, y + 1]);
        }
        if (x !== 0 && game_state[y + 1][x - 1][0] === "w") {
          valid_moves.push([x - 1, y + 1]);
        }
        if (x !== 7 && game_state[y + 1][x + 1][0] === "w") {
          valid_moves.push([x + 1, y + 1]);
        }
      }
    }
    // For a rook
    else if (pawn[1] === "R") {
      valid_moves = rook_valid_moves(x, y, pawn, game_state);
    }
    // For knight
    else if (pawn[1] === "K" && pawn.length > 2) {
      let pawn_color = pawn[0];

      const kn_moves = [
        [x + 2, y + 1],
        [x + 2, y - 1],
        [x - 2, y - 1],
        [x - 2, y + 1],
        [x + 1, y - 2],
        [x - 1, y - 2],
        [x + 1, y + 2],
        [x - 1, y + 2],
      ];

      for (let i = 0; i <= kn_moves.length - 1; i++) {
        let move = kn_moves[i];

        if (move[0] <= 7 && move[1] <= 7 && move[0] >= 0 && move[1] >= 0) {
          if (game_state[move[1]][move[0]] === "") {
            valid_moves.push(move);
          }
          if (
            game_state[move[1]][move[0]] !== "" &&
            game_state[move[1]][move[0]][0] !== pawn_color
          ) {
            valid_moves.push(move);
          }
        }
      }
    } else if (pawn[1] === "K" && pawn.length === 2) {
      let k_moves = [];
      let pawn_color = pawn[0];
      for (let i = 0; i <= 1; i++) {
        for (let j = 0; j <= 1; j++) {
          k_moves.push(
            [x + i, y + j],
            [x - i, y + j],
            [x - i, y - j],
            [x + i, y - j]
          );
        }
      }
      for (let i = 0; i <= k_moves.length - 1; i++) {
        let move = k_moves[i];
        if (move[0] <= 7 && move[1] <= 7 && move[0] >= 0 && move[1] >= 0) {
          if (game_state[move[1]][move[0]] === "") {
            valid_moves.push(move);
          }
          if (
            game_state[move[1]][move[0]] !== "" &&
            game_state[move[1]][move[0]][0] !== pawn_color
          ) {
            valid_moves.push(move);
          }
        }
      }
    } else if (pawn[1] === "B") {
      valid_moves = get_bishop_moves(x, y, pawn, game_state);
    }
    // Queen
    else if (pawn[1] === "Q") {
      // First get up, down, left, right; just like rook.
      valid_moves = rook_valid_moves(x, y, pawn, game_state);
      let b_moves = get_bishop_moves(x, y, pawn, game_state);
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

  let board_data = getBoardData();

  if (connection === false) {
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
  } else {
    return (
      <div className="game">
        <div className="panel">
          <Button
            onClick={() => {
              set_game_state(newGame());
              set_next_move("White");
            }}
            className="panel-but"
          >
            New Game
          </Button>
          <div className="next-move">
            <Typography variant="subtitle1">Your color is | {color}</Typography>

            <Typography variant="subtitle1">Next Move | {next_move}</Typography>
          </div>
          <Button
            href="/"
            className="panel-but"
          >
            Exit
          </Button>
        </div>
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

// Helper functions
function check_if_valid_move(x, y, valid_moves) {
  for (let i = 0; i <= valid_moves.length - 1; i++) {
    if (valid_moves[i][0] === x && valid_moves[i][1] === y) {
      return true;
    }
  }
  return false;
}

function rook_valid_moves(x, y, pawn, game_state) {
  let i = 1;
  let valid_moves = [];
  while (true) {
    if (x + i > 7) {
      break;
    }
    if (game_state[y][x + i] !== "") {
      let pawn2 = game_state[y][x + i];
      if (pawn2 === undefined) {
        break;
      }
      if (pawn2[0] !== pawn[0]) {
        valid_moves.push([x + i, y]);
      }
      break;
    }
    valid_moves.push([x + i, y]);
    i += 1;
  }
  i = 1;
  while (true) {
    if (x - i < 0) {
      break;
    }
    if (game_state[y][x - i] !== "") {
      let pawn2 = game_state[y][x - i];
      if (pawn2 === undefined) {
        break;
      }
      if (pawn2[0] !== pawn[0]) {
        valid_moves.push([x - i, y]);
      }
      break;
    }
    valid_moves.push([x - i, y]);
    i += 1;
  }
  i = 1;
  while (true) {
    if (y + i > 7) {
      break;
    }
    if (game_state[y + i][x] !== "") {
      let pawn2 = game_state[y + i][x];
      if (pawn2 === undefined) {
        break;
      }
      if (pawn2[0] !== pawn[0]) {
        valid_moves.push([x, y + i]);
      }
      break;
    }
    valid_moves.push([x, y + i]);
    i += 1;
  }
  i = 1;
  while (true) {
    if (y - i < 0) {
      break;
    }
    if (game_state[y - i][x] !== "") {
      let pawn2 = game_state[y - i][x];
      if (pawn2 === undefined) {
        break;
      }
      if (pawn2[0] !== pawn[0]) {
        valid_moves.push([x, y - i]);
      }
      break;
    }
    valid_moves.push([x, y - i]);
    i += 1;
  }
  return valid_moves;
}

function get_bishop_moves(x, y, pawn, game_state) {
  let i = 1;
  let valid_moves = [];

  while (true) {
    if (x + i > 7 || y + i > 7) {
      break;
    }
    if (game_state[y + i][x + i] !== "") {
      let pawn2 = game_state[y + i][x + i];
      if (pawn2 === undefined) {
        break;
      }
      if (pawn2[0] !== pawn[0]) {
        valid_moves.push([x + i, y + i]);
      }
      break;
    }
    valid_moves.push([x + i, y + i]);
    i += 1;
  }
  i = 1;
  while (true) {
    if (x - i < 0 || y - i < 0) {
      break;
    }
    if (game_state[y - i][x - i] !== "") {
      let pawn2 = game_state[y - i][x - i];
      if (pawn2 === undefined) {
        break;
      }
      if (pawn2[0] !== pawn[0]) {
        valid_moves.push([x - i, y - i]);
      }
      break;
    }
    valid_moves.push([x - i, y - i]);
    i += 1;
  }
  i = 1;
  while (true) {
    if (y + i > 7 || x - i < 0) {
      break;
    }
    if (game_state[y + i][x - i] !== "") {
      let pawn2 = game_state[y + i][x - i];
      if (pawn2 === undefined) {
        break;
      }
      if (pawn2[0] !== pawn[0]) {
        valid_moves.push([x - i, y + i]);
      }
      break;
    }
    valid_moves.push([x - i, y + i]);
    i += 1;
  }
  i = 1;
  while (true) {
    if (y - i < 0) {
      break;
    }
    if (game_state[y - i][x + i] !== "") {
      let pawn2 = game_state[y - i][x + i];
      if (pawn2 === undefined) {
        break;
      }
      if (pawn2[0] !== pawn[0]) {
        valid_moves.push([x + i, y - i]);
      }
      break;
    }
    valid_moves.push([x + i, y - i]);
    i += 1;
  }
  return valid_moves;
}

/*
function check_if_castling(x, y, pawn, game_state) {

}*/

export default Board;
