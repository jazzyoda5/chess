import "fontsource-roboto";
import React, { useState } from "react";
import "../static/style.css";
import Square from "./square";
import Panel from "./panel.js";
import PawnDialog from "./choose_pawn";

const extras = require("./extras.js");

const letters = "abcdefgh";

function OfflineBoard(props) {
  const [clicked_square, set_clicked_square] = useState(null);
  const [game_state, set_game_state] = useState(extras.newGame());
  const [next_move, set_next_move] = useState("White");
  const [check, set_check] = useState(null);
  const [valid_moves, set_valid_moves] = useState([]);
  const [end_w, set_end_w] = useState(null);
  const [end_b, set_end_b] = useState(null);

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
    const i = tag[1] - 1;

    // Get j
    const j = letters.indexOf(tag[0]);

    const value = game_state[i][j];

    return value;
  };

  function handleClick(tag) {
    const local_game_state = JSON.parse(JSON.stringify(game_state));

    /*
            - pawn is the value of previosly chosen square
            - value is the value of second chosen square!
            */

    // coordinates of clicked square
    const coor_x = letters.indexOf(tag[0]);
    const coor_y = tag[1] - 1;

    // Get pawn in the square that is clicked
    const value = local_game_state[coor_y][coor_x];

    // Whose move it is
    let next_move1 = next_move[0].toLowerCase();

    // If no pawn has been chosen in previou click, choose a pawn
    if (clicked_square === null && value !== "" && value[0] === next_move1) {
      // Set clicked_square in state
      // Set valid next moves in state
      console.log("jakob56");
      const vm = getValidMoves(coor_x, coor_y, value, local_game_state);
      console.log(
        "v_moves: ",
        v_moves(local_game_state, vm, coor_x, coor_y, value)
      );
      set_clicked_square([coor_x, coor_y]);
      set_valid_moves(v_moves(local_game_state, vm, coor_x, coor_y, value));
    }

    // If pawn was already previously chosen, make a move
    else if (clicked_square !== null) {
      // Get coor of previously chosen pawn
      var pawn_x = clicked_square[0];
      var pawn_y = clicked_square[1];

      // Now get previously chosen pawn value
      var pawn = local_game_state[pawn_y][pawn_x];

      // !!! What to do depends on value on chosen square

      // if chosen pawn and clicked pawn are same color
      if (value[0] === pawn[0]) {
        set_clicked_square([coor_x, coor_y]);
        const vm = getValidMoves(coor_x, coor_y, value, local_game_state);

        set_valid_moves(v_moves(local_game_state, vm, coor_x, coor_y, value));
      } else {
        // If move is valid
        if (
          extras.check_if_valid_move(
            coor_x,
            coor_y,
            valid_moves,
            local_game_state
          )
        ) {
          /* If the previous move checked the opponent
              opponent must make sure his next move
              unchecks his king
          */
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
            handleCastling(castling, local_game_state, next_move1);
            return;
          }

          // Check if it is a pawn that reached the end
          // Of the board
          if (pawn === "wP" && coor_y === 0) {
            set_end_w([coor_x, coor_y, "wP"]);
          }
          if (pawn === "bP" && coor_y === 7) {
            set_end_b([coor_x, coor_y, "bP"]);
          }
          // figure out next move
          if (next_move1 === "w") {
            // White moved, check check on black
            if (
              checkCheck(
                updateGameState(
                  coor_x,
                  coor_y,
                  pawn_x,
                  pawn_y,
                  pawn,
                  local_game_state
                ),
                "w"
              )
            ) {
              handleCheck("b");
              console.log("check on black");
            }
            set_next_move("Black");
          } else {
            // Black moved, check check on white
            if (
              checkCheck(
                updateGameState(
                  coor_x,
                  coor_y,
                  pawn_x,
                  pawn_y,
                  pawn,
                  local_game_state
                ),
                "b"
              )
            ) {
              handleCheck("w");
              console.log("check on white");
            }
            set_next_move("White");
          }
          makeMove(coor_x, coor_y, pawn_x, pawn_y, pawn, local_game_state);
          // If move is not valid
        } else {
          console.log("else runs");
          const vm = getValidMoves(coor_x, coor_y, value, local_game_state);

          set_clicked_square([coor_x, coor_y]);
          set_valid_moves(v_moves(local_game_state, vm, coor_x, coor_y, value));
        }
      }
    }
    console.log("game_state_end: ", local_game_state);
  }

  const makeMove = (x, y, pawn_x, pawn_y, pawn, local_game_state) => {
    console.log("update game state runs");
    set_clicked_square(null);
    set_valid_moves([]);
    set_game_state(
      updateGameState(x, y, pawn_x, pawn_y, pawn, local_game_state)
    );
  };

  const handleCastling = (type, state, next_move) => {
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

    console.log("update game state runs");
    set_clicked_square(null);
    set_valid_moves([]);
    set_game_state(state);

    if (next_move === "w") {
      set_next_move("Black");
    } else {
      set_next_move("White");
    }
  };

  const v_moves = (state, moves, x, y, pawn) => {
    let v_moves = [];
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
    return v_moves;
  };

  const getValidMoves = (x, y, pawn, local_game_state, checking_check=false) => {
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
      // If king is in his starting position
      // Castling might be possible
      const c_move = extras.castling_possible(x, y, pawn, local_game_state);
      if (c_move !== false && !checking_check) {
        console.log("add_castling_move");
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

  const switchPawn = (x, y, pawn) => {
    let updated_game_state = JSON.parse(JSON.stringify(game_state));
    updated_game_state[y][x] = pawn;
    set_game_state(updated_game_state);
    set_end_b(null);
    set_end_w(null);
  };

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

  const checkCheck = (igame_state, color) => {
    // Get all valid moves
    // And see if anyone can eat the opponent's king
    for (let i = 0; i <= igame_state.length - 1; i++) {
      for (let j = 0; j <= igame_state[i].length - 1; j++) {
        let pawn = igame_state[i][j];

        if (pawn[0] === color) {
          // When doing this don't check for castling move
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

  const handleCheck = (color) => {
    // color = Color of the king that is in danger
    set_check(color);
  };

  const handleExit = () => {
    void 0;
  };

  // Set the board
  let board_data = getBoardData();

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
      <Panel
        set_game_state={set_game_state}
        set_next_move={set_next_move}
        set_check={set_check}
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
                      check={check}
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

export default OfflineBoard;
