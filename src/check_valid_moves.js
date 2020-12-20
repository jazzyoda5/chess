
    checkIfValidMove(x, y, pawn_x, pawn_y, pawn) {
        /*
        each pawn has different valid moves
        1. check what pawn it is
        2. check for possible moves
        */
        // Get game state
        const game_state = this.state.game_state;

        console.log('pawn: ', pawn);
        // For pawns
        if (pawn[1] === 'P') {

            // White pawn
            if (pawn[0] === 'w') {
                if (x === pawn_x) {
                    let y_dif = y - pawn_y;
                    if (y_dif === -1) {
                        // Check if there is a pawn infront
                        if (game_state[y][x] === '') {
                            return true;
                        }
                        return false;
                    }
                    // Can move 2 squares forward
                    // If in starting position
                    if (pawn_y === 6 && y_dif === -2) {
                        return true;
                    }
                    return false;
                }

                // To eat opponent's pawns
                // Get value on what is on the squares where a pwn can eat
                if (y === (pawn_y - 1)) {
                    if (x === pawn_x - 1 || x === pawn_x + 1) {
                        // Now check if there is a black pawn there
                        let left = game_state[pawn_y - 1][pawn_x - 1];
                        let right = game_state[pawn_y - 1][pawn_x + 1];

                        if (pawn_x === 0) {
                            if (right[0] === 'b') {
                                return true;
                            } 
                        }
                        if (pawn_x === 7) {
                            if (left[0] === 'b') {
                                return true;
                            }
                        } else {
                            if (left[0] === 'b' || right[0] === 'b') {
                                return true;
                            }
                        }
                    }
                }
                return false;

            }
            // Black pawn
            if (pawn[0] === 'b') {
                if (x === pawn_x) {
                    let y_dif = y - pawn_y;
                    if (y_dif === 1) {
                        // Check if there is a pawn infront
                        if (game_state[y][x] === '') {
                            return true;
                        }
                        return false;
                    }
                    // Can move 2 squares forward
                    // If in starting position
                    if (pawn_y === 1 && y_dif === 2) {
                        return true;
                    }
                    return false;
                }
                // To eat opponent's pawns
                // Get value on what is on the squares where a pwn can eat
                if (y === (pawn_y + 1)) {
                    if (x === pawn_x - 1 || x === pawn_x + 1) {
                        // Now check if there is a white pawn there
                        let left = game_state[pawn_y + 1][pawn_x - 1];
                        let right = game_state[pawn_y + 1][pawn_x + 1];

                        if (pawn_x === 0) {
                            if (right[0] === 'w') {
                                return true;
                            } 
                        }
                        if (pawn_x === 7) {
                            if (left[0] === 'w') {
                                return true;
                            }
                        } else {
                            if (left[0] === 'w' || right[0] === 'w') {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
        }
        // For rooks
        if (pawn[1] === 'R') {

            // Can not jump other pawns
            // only change y or only change x

            // When going along x axis.
            if (x !== pawn_x && y === pawn_y) {
                console.log('jakobx')
                // Get absolute value of path.length
                let temp = pawn_x - x;
                if (temp > 0) {
                    console.log('jakob1')
                    for (let i = 1; i <= Math.abs(temp) - 1; i++) {
                        if (game_state[pawn_y][pawn_x - i] !== '') {
                            return false;
                        }
                    }
                    return true;
                } else if (temp < 0) {
                    console.log('jakob2')
                    for (let i = 1; i <= Math.abs(temp) - 1; i++) {
                        if (game_state[pawn_y][pawn_x + i] !== '') {
                            return false;
                        }
                    }
                    console.log('jakob3')
                    return true;
                }
            }

            // Going down y axis
            if (y !== pawn_y && x === pawn_x) {
                // Get absolute value of path.length
                let temp = pawn_y - y;
                if (temp > 0) {
                    for (let i = 1; i <= Math.abs(temp) - 1; i++) {
                        if (game_state[pawn_y - i][pawn_x] !== '') {
                            return false;
                        }
                    }
                    return true;
                } else if (temp < 0) {
                    for (let i = 1; i <= Math.abs(temp) - 1; i++) {
                        if (game_state[pawn_y + i][pawn_x] !== '') {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        }
        // Bishop
        if (pawn[1] === 'B') {

        }
        
    }
