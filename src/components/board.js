import React from "react";
import { Component } from "react";

import '../static/style.css';

import Square from './square';

const letters = 'abcdefgh';

class Board extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clicked_square: null,
            game_state: this.newGame
        };

        this.checkIfValidMove = this.checkIfValidMove.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.newGame = this.newGame.bind(this);
        this.getRow = this.getRow.bind(this);
        this.getBoardData = this.getBoardData.bind(this);
        this.getSquareValue = this.getSquareValue.bind(this);
        this.consoleLog = this.consoleLog.bind(this);
    }
    UNSAFE_componentWillMount() {
        this.newGame();
    }
  

    // Function to set a new game
    newGame() {
        let new_game = [];

        // Tags for pawns
        var b_pawns = ['bR', 'bKn', 'bB', 'bQ', 'bK', 'bB', 'bKn', 'bR'];
        var w_pawns = ['wR', 'wKn', 'wB', 'wQ', 'wK', 'wB', 'wKn', 'wR'];

        // Num of squares on whole board

        for (let i = 0; i <= 7; i++) {

            new_game.push([]);
            
            for (let j = 0; j <= 7; j++) {
                if (i === 0) {
                    new_game[i].push({});
                    new_game[i][j] = b_pawns[j];
                } else if (i === 1) {
                    new_game[i].push({});
                    new_game[i][j] = 'bP';
                } else if (i === 6) {
                    new_game[i].push({});
                    new_game[i][j] = 'wP';
                } else if (i === 7) {
                    new_game[i].push({});
                    new_game[i][j] = w_pawns[j];
                } else {
                    new_game[i].push({});
                    new_game[i][j] = '';
                }
            }
        }

        // Set new_game as state
        this.setState({
            game_state: new_game
        });
    }
            
    // To console.log state
    consoleLog() {
        console.log(this.state.clicked_square);
    }

    getRow(num) {
        let row = [];

        for (let i = 0; i <= 7; i++) {
            let tag = letters[i] + num.toString();
            row.push({
                tag: tag,
            });
        }
        return row;
    }
    getBoardData() {
        let board_data = [];
        for (let i = 0; i <= 7; i++) {
            let row = this.getRow(i + 1);
            board_data.push(row);
        }
        return board_data;
    }

    getSquareValue(tag) {
        let game_state = this.state.game_state
        // Get i
        let i = tag[1] - 1;
        
        // Get j
        let j = letters.indexOf(tag[0]);

        let value = game_state[i][j];

        return value;
    } 
    handleClick(tag) {
        /*
        - pawn is the value of previosly chosen square
        - value is the value of second chosen square!
        */
       
        // coordinates of clicked square
        let coor_x = letters.indexOf(tag[0]);
        let coor_y = tag[1] - 1;

        // Game state
        var game_state = this.state.game_state;
        // Get pawn in the square that is clicked
        const value = game_state[coor_y][coor_x]

        // If no pawn has been chosen in previou click, choose a pawn
        if (this.state.clicked_square === null && value !== '') {
        // Set clicked_square in state
            this.setState({
                clicked_square: [coor_x, coor_y]
            });            
        }
        
        // If pawn was already previously chosen, make a move
        if (this.state.clicked_square !== null) {
            // Get coor of previously chosen pawn
            let pawn_x = this.state.clicked_square[0];
            let pawn_y = this.state.clicked_square[1];

            // Now get previously chosen pawn value
            let pawn = game_state[pawn_y][pawn_x];

            // !!! What to do depends on value on chosen square

            // if chosen pawn and clicked pawn are same color
            if (value[0] === pawn[0]) {
                this.setState({
                    clicked_square: [coor_x, coor_y]
                });
            }
            // if clicked quare is empty, make a move
            else {
                if (this.checkIfValidMove(coor_x, coor_y, pawn_x, pawn_y, pawn)) {
                    console.log('move valid');
                    
                    game_state[pawn_y][pawn_x] = '';
                    game_state[coor_y][coor_x] = pawn;
                    this.setState({
                        game_state: game_state,
                        clicked_square: null
                    });                          
                } else {
                    console.log('move not valid')
                }    

            }
        
        }
    }
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
        
    }

    render() {
        let board_data = this.getBoardData();

        return (
            <div className="board">
                {board_data.map((row) => {
                    return (
                        <div className="board-row">
                            {row.map((square) => {
                                return (
                                    <Square
                                        tag={square.tag}
                                        value={this.getSquareValue(square.tag)}
                                        handleClick={this.handleClick}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
                <button onClick={() => { this.consoleLog() }}>
                    log state
                </button>
            </div>
        );
    }
}

export default Board;
