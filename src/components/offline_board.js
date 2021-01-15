import "fontsource-roboto";
import React, { useState, useEffect } from "react";
import "../static/style.css";
import Square from "./square";
import Panel from "./panel.js";
import PawnDialog from "./choose_pawn";
import ChooseColorDialog from "./choose_color_dialog";
import CheckmateDialog from "./checkmate_dialog";
import { socket } from "../socket/socket";

const extras = require("./extras.js");

const letters = "abcdefgh";

/*
There will be two options:
- To choose a 2-player offline game
- To play against the computer
*/

function OfflineBoard(props) {
  const [clicked_square, set_clicked_square] = useState(null);
  const [game_state, set_game_state] = useState(extras.newGame());
  const [next_move, set_next_move] = useState("White");
  const [check, set_check] = useState(null);
  const [valid_moves, set_valid_moves] = useState([]);
  const [end_w, set_end_w] = useState(null);
  const [end_b, set_end_b] = useState(null);
  const [checkmate, set_checkmate] = useState(false);
  const [comp_color, set_comp_color] = useState(null);
  const [player_color, set_player_color] = useState(null);

  useEffect(() => {
    socket.on("computer-move", (data) => {
      console.log("[SOCKET] Recieved a move from the server. -> ", data);
      // Make a move
      makeComputerMove(data);
    });
  }, [comp_color]);

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
    if (props.mode !== "1player" || next_move === player_color) {
      // Make a copy of the game_state
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
        const vm = getValidMoves(coor_x, coor_y, value, local_game_state);
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
          if (value[0] === next_move1) {
            set_valid_moves(
              v_moves(local_game_state, vm, coor_x, coor_y, value)
            );
          } else if (value[0] !== next_move) {
            set_valid_moves([]);
          }
        } else {
          // There is no pawn of the samo color on clicked square
          // Try to make a move
          if (
            extras.check_if_valid_move(
              coor_x,
              coor_y,
              valid_moves,
              local_game_state
            )
          ) {
            // Move is valid

            // Castling is handled by a different method
            // than making a move
            const castling = extras.check_if_castling(
              coor_x,
              coor_y,
              pawn_x,
              pawn_y,
              pawn,
              local_game_state
            );

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
              set_next_move("Black");
            } else {
              set_next_move("White");
            }
            makeMove(coor_x, coor_y, pawn_x, pawn_y, pawn, local_game_state);
            // If move is not valid
          } else {
            console.log("else runs");
            const vm = getValidMoves(coor_x, coor_y, value, local_game_state);

            set_clicked_square([coor_x, coor_y]);
            if (value[0] === next_move1) {
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
  }

  const makeMove = (x, y, pawn_x, pawn_y, pawn, local_game_state) => {
    const updated_game_state = updateGameState(
      x,
      y,
      pawn_x,
      pawn_y,
      pawn,
      local_game_state
    );
    set_game_state(updated_game_state);
    set_clicked_square(null);
    set_valid_moves([]);
    // Check for check after making a move
    let color1 = "b";
    if (pawn[0] === "b") {
      color1 = "w";
    }
    console.log("updated_game_state: ", updated_game_state);
    if (checkCheck(updated_game_state, pawn[0])) {
      handleCheck(color1, updated_game_state);
    } else {
      set_check(null);
    }

    // If playing against the computer
    if (props.mode === "1player" && !end_b && !end_w && !checkmate) {
      const data = extras.getComputerMoveData(
        updated_game_state,
        comp_color,
        getValidMoves,
        v_moves
      );
      // Emit the data to the server
      socket.emit("computer-move", {
        game_state: updated_game_state,
        comp_color: comp_color,
      });
      console.log("data emitted", data);
    }
  };

  const makeComputerMove = (data) => {
    let local_game_state = data["game_state"];
    console.log("comp_color: ", comp_color);
    let color1 = "b";
    let color2 = "Black";
    if (comp_color === "b") {
      color1 = "w";
      color2 = "White";
    }

    set_game_state(local_game_state);
    set_next_move(color2);

    if (checkCheck(local_game_state, comp_color)) {
      handleCheck(color1, local_game_state);
    } else {
      set_check(null);
    }
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

  // This function makes sure
  // You can't put your self in check
  const v_moves = (state, moves, x, y, pawn) => {
    let v_moves = [];

    // For every move in valid_moves check for check
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
      // If king is in his starting position
      // Castling might be possible
      const c_move = extras.castling_possible(x, y, pawn, local_game_state);
      // c_move !== undefined is a quick bug fix
      if (c_move !== false && !checking_check && c_move !== undefined) {
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

  const switchPawn = (x, y, pawn_x, pawn_y, pawn, next_move1) => {
    let updated_game_state = JSON.parse(JSON.stringify(game_state));
    updated_game_state[y][x] = pawn;
    set_game_state(updated_game_state);
    set_end_b(null);
    set_end_w(null);

    // After switching the pawn, make a computer move is mode is 1player
    if (props.mode === "1player") {
      const data = extras.getComputerMoveData(
        updated_game_state,
        comp_color,
        getValidMoves,
        v_moves
      );
      // Emit the data to the server
      socket.emit("computer-move", {
        data: data,
        game_state: updated_game_state,
        comp_color: comp_color,
      });
      console.log("data emitted", data);
    }
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
          let valid_moves1 = getValidMoves(j, i, pawn, igame_state, true);
          for (let k = 0; k <= valid_moves1.length - 1; k++) {
            let pawn_on_pos =
              igame_state[valid_moves1[k][1]][valid_moves1[k][0]];
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

  // lg_state == local_game_state
  const handleCheck = (color, lg_state) => {
    // color = Color of the king that is in danger
    set_check(color);

    // Check if it checkmate
    const mate = checkCheckmate(lg_state, color);

    if (mate) {
      let i = "w";
      if (mate === "w") {
        i = "b";
      }
      set_checkmate(i);
    }
  };

  const checkCheckmate = (state, color) => {
    // color = color of king in danger
    // Get all possible moves and if there are no possible moves
    // It is checkmate
    let v_moves1 = [];
    console.log("checkmate state: ", state);

    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        let pawn = state[i][j];

        if (pawn[0] === color) {
          const vm = getValidMoves(j, i, pawn, state);
          let moves = v_moves(state, vm, j, i, pawn);
          if (moves.length > 0) {
            for (let x = 0; x <= moves.length - 1; x++) {
              v_moves1.push(moves[x]);
            }
          }
        }
      }
    }
    if (v_moves1.length < 1) {
      console.log("possible moves: ", v_moves1);
      return color;
    }
    console.log("v_moves length: ", v_moves1.length);
    return false;
  };

  const handleColorChoice = (color) => {
    set_player_color(color);
    console.log("color: ", color);
    if (color === "White") {
      set_comp_color("b");
    } else {
      set_comp_color("w");
      // If computer if white make first move
      const data = extras.getComputerMoveData(
        game_state,
        "w",
        getValidMoves,
        v_moves
      );
      // Emit the data to the server
      socket.emit("computer-move", {
        game_state: game_state,
        comp_color: "w",
      });
      console.log("data emitted", data);
    }
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
      {checkmate !== false ? (
        <CheckmateDialog
          open={true}
          winner={checkmate}
          handleExit={handleExit}
        />
      ) : null}
      {props.mode === "1player" && !comp_color && !player_color ? (
        <ChooseColorDialog open={true} handleColorChoice={handleColorChoice} />
      ) : null}
      <Panel
        mode={props.mode}
        color={player_color}
        set_game_state={set_game_state}
        set_next_move={set_next_move}
        set_check={set_check}
        set_comp_color={set_comp_color}
        set_player_color={set_player_color}
        handleExit={handleExit}
        next_move={next_move}
        online={false}
      />
      <div className="board">
        <div className="squares">
          {board_data.map((row, i) => {
            return (
              <div className="board-row" key={i}>
                {row.map((square) => {
                  return (
                    <Square
                      key={square.tag}
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
