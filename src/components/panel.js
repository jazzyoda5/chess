import React from "react";
import '../static/panel.css';
import {
    Button,
    Typography,
  } from "@material-ui/core";
import { Link } from 'react-router-dom';

const extras = require("./extras.js");

function Panel(props) {
  return (
    <div className="panel">
      {(!props.online) ? <Button
        onClick={() => {
          props.set_game_state(extras.newGame());
          props.set_next_move("White");
          props.set_check(null);
        }}
        className="panel-but"
      >
        New Game
      </Button> : null }
      <div className="next-move">
        {(props.online === true)
        ? <Typography variant="subtitle1">Your color is | <strong>{props.color}</strong></Typography>
        : null
        }
        <Typography variant="subtitle1">Next Move | <strong>{props.next_move}</strong></Typography>
      </div>
        <Button
          component={Link}
          to={'/'}
          onClick={() => {
            props.handleExit();
          }}
          className="panel-but"
        >
          Exit
        </Button>
    </div>
  );
}

export default Panel;
