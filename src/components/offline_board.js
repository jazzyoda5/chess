import "fontsource-roboto";
import React, { useState } from "react";
import "../static/style.css";
import Square from "./square";
import Panel from "./panel.js";

const extras = require("./extras.js");

const letters = "abcdefgh";

function OfflineBoard(props) {
  const [clicked_square, set_clicked_square] = useState(null);
  const [game_state, set_game_state] = useState(extras.newGame());
  const [next_move, set_next_move] = useState("White");
  // const [check, set_check] = useState(null);
  const [valid_moves, set_valid_moves] = useState(null);

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
        if (extras.check_if_valid_move(coor_x, coor_y, valid_moves)) {
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

  const handleExit = () => {
      void(0);
  }

  // Set the board
  let board_data = getBoardData();

  return (
    <div className="game">
      <Panel
        set_game_state={set_game_state}
        set_next_move={set_next_move}
        handleExit={handleExit}
        next_move={next_move}
        online={false}
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

export default OfflineBoard;
