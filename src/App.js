import './App.css';
import { Component } from 'react';
import Board from './components/board.js';

class App extends Component {
  render () {
    return (
      <div className="App">
        <h1>Chess</h1>
        <Board />
      </div>
    );
  }
}

export default App;
