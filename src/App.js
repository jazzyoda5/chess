import "./App.css";
import { Component, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Board from "./components/board.js";
import Menu from "./components/menu.js";
import "fontsource-roboto";
import Typography from '@material-ui/core/Typography';

function App(props) {
  return (
    <div className="App">
      <Typography variant="h2" component="h2" gutterBottom>
        Chess
      </Typography>
      <Router>
        <Switch>
          <Route path="/online">
            <Board />
          </Route>
          <Route path="/">
            <Menu />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
