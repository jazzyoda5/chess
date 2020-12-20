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

        //this.getValidMoves = this.getValidMoves.bind(this);
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
        console.log(this.state.valid_moves);
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
        // Set valid next moves in state
            console.log('jakob1');
            this.setState({
                clicked_square: [coor_x, coor_y],
                valid_moves: this.getValidMoves(coor_x, coor_y, value)
            }); 

        }
        
        // If pawn was already previously chosen, make a move
        else if (this.state.clicked_square !== null) {

            // Get coor of previously chosen pawn
            let pawn_x = this.state.clicked_square[0];
            let pawn_y = this.state.clicked_square[1];

            // Now get previously chosen pawn value
            let pawn = game_state[pawn_y][pawn_x];

            // !!! What to do depends on value on chosen square

            // if chosen pawn and clicked pawn are same color
            if (value[0] === pawn[0]) {
                this.setState({
                    clicked_square: [coor_x, coor_y],
                    valid_moves: this.getValidMoves(coor_x, coor_y, value)
                });
            }
            // if move is valid, make the move
            if (check_if_valid_move(coor_x, coor_y, this.state.valid_moves)) {
                game_state[coor_y][coor_x] = pawn;
                game_state[pawn_y][pawn_x] = ""
                this.setState({
                    game_state: game_state,
                    clicked_square: null
                });
            } else {
                console.log('move not valid');
                console.log('move: ', coor_x, coor_y);
            }

        }
    }
    
    getValidMoves(x, y, pawn) {
        let valid_moves = [];
        const game_state = this.state.game_state;

        if (pawn[1] === 'P') {
            // White pawn
            if (pawn[0] === 'w') {
                if (y === 6) {
                    console.log(game_state[y - 2][x]);
                    if (game_state[y - 2][x] === '') {
                        valid_moves.push([x, y - 2]);
                    }
                }
                if (game_state[y - 1][x] === '') {
                    valid_moves.push([x, y - 1]);
                }
                if (x !== 0 && game_state[y - 1][x - 1][0] === 'b') {
                    valid_moves.push([x - 1, y - 1]);
                }
                if (x !== 7 && game_state[y - 1][x + 1][0] === 'b') {
                    valid_moves.push([x + 1, y - 1]);
                }
            }
            else if (pawn[0] === 'b') {
                if (y === 1) {
                    if (game_state[y + 2][x] === '') {
                        valid_moves.push([x, y + 2]);
                    }
                }
                if (game_state[y + 1][x] === '') {
                    valid_moves.push([x, y + 1]);
                }
                if (x !== 0 && game_state[y + 1][x - 1][0] === 'w') {
                    valid_moves.push([x - 1, y + 1]);
                }
                if (x !== 7 && game_state[y + 1][x + 1][0] === 'w') {
                    valid_moves.push([x + 1, y + 1]);
                }
            }
        }
        else if (pawn[1] === 'R') {
            let i = 1;
            while (true) {
                if (x + i > 7) {break;}
                if (game_state[y][x + i] !== '') {
                    let pawn2 = game_state[y][x + i];
                    if(pawn2 === undefined) {break;}
                    if (pawn2[0] !== pawn[0]) {
                        valid_moves.push([x + i, y]);
                    }
                    break
                }
                valid_moves.push([x + i, y]);
                i += 1;
            }
            i = 1;
            while (true) {
                if (x - i < 0) {break;}
                if (game_state[y][x - i] !== '') {
                    let pawn2 = game_state[y][x - i];
                    if (pawn2 === undefined) {break;}
                    if (pawn2[0] !== pawn[0]) {
                        valid_moves.push([x - i, y]);
                    }
                    break
                }
                valid_moves.push([x - i, y]);
                i += 1;
            }
            i = 1;
            while (true) {
                if (y + i > 7) {break;}
                if (game_state[y + i][x] !== '') {
                    let pawn2 = game_state[y + i][x];
                    if (pawn2 === undefined) {break;}
                    if (pawn2[0] !== pawn[0]) {
                        valid_moves.push([x, y + i]);
                    }
                    break
                }
                valid_moves.push([x, y + i]);
                i += 1;
            }
            i = 1;
            while (true) {
                if (y - i < 0) {break;}
                if (game_state[y - i][x] !== '') {
                    let pawn2 = game_state[y - i][x];
                    if (pawn2 === undefined) {break;}
                    if (pawn2[0] !== pawn[0]) {
                        valid_moves.push([x, y - i]);
                    }
                    break
                }
                valid_moves.push([x, y - i]);
                i += 1;
            }
        } /*
        else if (pawn[0] === 'Kn') {
            
        } */
        console.log(valid_moves);
        return valid_moves;
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

function check_if_valid_move(x, y, valid_moves) {
    for(let i = 0; i <= valid_moves.length - 1; i++) {
        if (valid_moves[i][0] === x && valid_moves[i][1] === y) {
            return true;
        }
    }
    return false;
}

export default Board;
