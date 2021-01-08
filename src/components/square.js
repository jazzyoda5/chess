import React from "react";
import bK from "../static/pawns/bK.png";
import bKn from "../static/pawns/bKn.png";
import bP from "../static/pawns/bP.png";
import bQ from "../static/pawns/bQ.png";
import bR from "../static/pawns/bR.png";
import bB from "../static/pawns/bB.png";
import wB from "../static/pawns/wB.png";
import wK from "../static/pawns/wK.png";
import wKn from "../static/pawns/wKn.png";
import wP from "../static/pawns/wP.png";
import wQ from "../static/pawns/wQ.png";
import wR from "../static/pawns/wR.png";

function Square(props) {

  const getBackgroundColor = () => {
    let tag = props.tag;
    // If king is checked background chould be red
    if (props.value[1] === 'K' && props.value.length !== 3 && props.check === props.value[0]) {
      return 'red';
    }
    // rows that start with black
    if (tag[1] % 2 !== 0) {
      let b_squares = ["a", "c", "e", "g"];
      if (b_squares.includes(tag[0])) {
        return "#80391e";
      }
      return "#edb879";
    } else {
      let w_squares = ["a", "c", "e", "g"];
      if (w_squares.includes(tag[0])) {
        return "#edb879";
      }
      return "#80391e";
    }
  };
  
  const getBgPng = () => {
    if (props.value === "bK") {
      return bK;
    }
    if (props.value === "bKn") {
      return bKn;
    }
    if (props.value === "bB") {
      return bB;
    }
    if (props.value === "bR") {
      return bR;
    }
    if (props.value === "bQ") {
      return bQ;
    }
    if (props.value === "bP") {
      return bP;
    }
    if (props.value === "wK") {
      return wK;
    }
    if (props.value === "wKn") {
      return wKn;
    }
    if (props.value === "wP") {
      return wP;
    }
    if (props.value === "wB") {
      return wB;
    }
    if (props.value === "wR") {
      return wR;
    }
    if (props.value === "wQ") {
      return wQ;
    }
  };

  const validMoveColor = () => {
    for (let i = 0; i <= props.validMoves.length - 1; i++) {
      if (props.validMoves[i] === props.tag) {
        return 'rgba(54, 54, 54, 0.425)';
      }
    }
    return 'rgba(54, 54, 54, 0)';
  }

  const tag = props.tag;
  return (
    <div
      className="square"
      style={{ 
        backgroundColor: getBackgroundColor()
      }}
    >
      <button
        style={{ 
          backgroundColor: validMoveColor(),
          backgroundImage: "url(" + getBgPng() + ")",
        }}
        onClick={() => {
          props.handleClick(tag)
        }
        }
      ></button>
    </div>
  );
}

export default Square;
