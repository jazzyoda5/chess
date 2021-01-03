import "./App.css";
import { Component, useState } from "react";
import Board from "./components/board.js";
import Menu from "./components/menu.js";

function App(props) {
  const [condition, setCondition] = useState(false);

  if (condition) {
    return (
      <div className="App">
        <h1>Chess</h1>
        <Board />
      </div>
    );
  } else {
    return (
      <div className="App">
        <h1>Chess</h1>
        <Menu />
      </div>
    );
  }
}

export default App;
