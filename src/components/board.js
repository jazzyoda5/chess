import React from "react";
import { Component } from "react";

import '../static/style.css';

import Square from './square';

// Get an empty board
let state = [];
for (let i = 0; i <= 7; i++) {
    state.push([]);
    for (let j = 0; j <= 7; j++) {
        state[i].push([]);
    }
}


class Board extends Component {
    constructor(props) {
        super(props);

        this.state = {
        
        };

        this.newGame = this.newGame.bind(this);
        this.getRow = this.getRow.bind(this);
        this.getBoardData = this.getBoardData.bind(this);
        this.getSquareValue = this.getSquareValue.bind(this);
        this.consoleLog = this.consoleLog.bind(this);
    }
    componentWillMount() {
        this.newGame();
    }
  

    // Function to set a new game
    newGame() {
        let new_game = [];

        // Letters for square tags
        const letters = 'abcdefgh'

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
        console.log(this.state.game_state);
    }

    getRow(num) {
        let row = [];
        const letters = 'abcdefgh';
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
        let letters = 'abcdefgh';
        let game_state = this.state.game_state
        // Get i
        let i = tag[1] - 1;
        
        // Get j
        let j = letters.indexOf(tag[0]);

        let value = game_state[i][j];

        return value;
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
                                    />
                                );
                            })}
                        </div>
                    );
                })}
                <button onClick={this.consoleLog}>
                    log state
                </button>
            </div>
        );
    }
}

export default Board;
