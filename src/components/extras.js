function check_if_valid_move(x, y, valid_moves) {
  for (let i = 0; i <= valid_moves.length - 1; i++) {
    if (valid_moves[i][0] === x && valid_moves[i][1] === y) {
      return true;
    }
  }
  return false;
}

function pawn_valid_moves(x, y, pawn, igame_state) {
  let valid_moves = [];

  // White pawn
  if (pawn[0] === "w") {
    if (y === 6) {
      if (igame_state[y - 2][x] === "") {
        valid_moves.push([x, y - 2]);
      }
    }
    if (igame_state[y - 1][x] === "") {
      valid_moves.push([x, y - 1]);
    }
    if (x !== 0 && igame_state[y - 1][x - 1][0] === "b") {
      valid_moves.push([x - 1, y - 1]);
    }
    if (x !== 7 && igame_state[y - 1][x + 1][0] === "b") {
      valid_moves.push([x + 1, y - 1]);
    }
  } else if (pawn[0] === "b") {
    if (y === 1) {
      if (igame_state[y + 2][x] === "") {
        valid_moves.push([x, y + 2]);
      }
    }
    if (igame_state[y + 1][x] === "") {
      valid_moves.push([x, y + 1]);
    }
    if (x !== 0 && igame_state[y + 1][x - 1][0] === "w") {
      valid_moves.push([x - 1, y + 1]);
    }
    if (x !== 7 && igame_state[y + 1][x + 1][0] === "w") {
      valid_moves.push([x + 1, y + 1]);
    }
  }
  return valid_moves;
}

function knight_valid_moves(x, y, pawn, igame_state) {
  let valid_moves = [];

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
      if (igame_state[move[1]][move[0]] === "") {
        valid_moves.push(move);
      }
      if (
        igame_state[move[1]][move[0]] !== "" &&
        igame_state[move[1]][move[0]][0] !== pawn_color
      ) {
        valid_moves.push(move);
      }
    }
  }
  return valid_moves;
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

function king_valid_moves(x, y, pawn, game_state) {
  let valid_moves = [];

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
  return valid_moves;
}

function check_if_castling(x, y, pawn_x, pawn_y, pawn, game_state) {
  if (pawn === "wK") {
    if (pawn_x === 4 && pawn_y === 7) {
      if (x === 6 && y === 7) {
        if (game_state[7][5] === "" && game_state[7][6] === "") {
          if (game_state[7][7] === "wR") {
            return "wR";
          }
        }
      } else if (x === 2 && y === 7) {
        for (let i = 1; i <= 3; i++) {
          if (game_state[7][i] !== "") {
            return false;
          }
        }
        if (game_state[7][0] === "wR") {
          return "wL";
        }
      }
    }
  } else if (pawn === "bK") {
    if (pawn_x === 4 && pawn_y === 0) {
      if (x === 6 && y === 0) {
        if (game_state[0][5] === "" && game_state[0][6] === "") {
          if (game_state[0][7] === "bR") {
            return "bR";
          }
        }
      } else if (x === 2 && y === 0) {
        for (let i = 1; i <= 3; i++) {
          if (game_state[0][i] !== "") {
            return false;
          }
        }
        if (game_state[0][0] === "bR") {
          return "bL";
        }
      }
    }
  } else {
    return false;
  }
}

function castling_possible(x, y, pawn, game_state) {
  if (pawn === "wK") {
    if (x === 4 && y === 7) {
      if (game_state[7][5] === "" && game_state[7][6] === "") {
        if (game_state[7][7] === "wR") {
          return [6, 7];
        }
      }
      for (let i = 1; i <= 3; i++) {
        if (game_state[7][i] !== "") {
          return false;
        }
      }
      if (game_state[7][0] === "wR") {
        return [2, 7];
      }
    }
  } else if ((pawn === "bK")) {
    if (x === 4 && y === 0) {
      if (game_state[0][5] === "" && game_state[0][6] === "") {
        if (game_state[0][7] === "bR") {
          return [6, 0];
        }
      }
      for (let i = 1; i <= 3; i++) {
        if (game_state[0][i] !== "") {
          return false;
        }
      }
      if (game_state[7][0] === "bR") {
        return [2, 0];
      }
    }
  }
}

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

module.exports = {
  check_if_valid_move,
  pawn_valid_moves,
  knight_valid_moves,
  rook_valid_moves,
  get_bishop_moves,
  king_valid_moves,
  newGame,
  check_if_castling,
  castling_possible
};
