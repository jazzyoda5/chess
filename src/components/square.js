import React from "react";
import bK from '../static/pawns/bK.png'
import bKn from '../static/pawns/bKn.png'
import bP from '../static/pawns/bP.png'
import bQ from '../static/pawns/bQ.png'
import bR from '../static/pawns/bR.png'
import bB from '../static/pawns/bB.png'
import wB from '../static/pawns/wB.png'
import wK from '../static/pawns/wK.png'
import wKn from '../static/pawns/wKn.png'
import wP from '../static/pawns/wP.png'
import wQ from '../static/pawns/wQ.png'
import wR from '../static/pawns/wR.png'



class Square extends React.Component {
  constructor(props) {
    super(props);

    this.getBgPng = this.getBgPng.bind(this);
    this.getBackgroundColor = this.getBackgroundColor.bind(this);
  }

  getBackgroundColor() {
    let tag = this.props.tag;
    // rows that start with black
    if (tag[1] % 2 !== 0) {
        let b_squares = ['a', 'c', 'e', 'g']
        if (b_squares.includes(tag[0])) {
            return '#80391e';
        }
        return '#edb879';
    } else {
        let w_squares = ['a', 'c', 'e', 'g']
        if (w_squares.includes(tag[0])) {
            return '#edb879';
        }
        return '#80391e';
    }
  }
  getBgPng() {
    if (this.props.value === 'bK') {
      return bK;
    }
    if (this.props.value === 'bKn') {
      return bKn;
    }
    if (this.props.value === 'bB') {
      return bB;
    }
    if (this.props.value === 'bR') {
      return bR;
    }
    if (this.props.value === 'bQ') {
      return bQ;
    }
    if (this.props.value === 'bP') {
      return bP;
    }
    if (this.props.value === 'wK') {
      return wK;
    }
    if (this.props.value === 'wKn') {
      return wKn;
    }
    if (this.props.value === 'wP') {
      return wP;
    }
    if (this.props.value === 'wB') {
      return wB;
    }
    if (this.props.value === 'wR') {
      return wR;
    }
    if (this.props.value === 'wQ') {
      return wQ;
    }
  }

  render() {
    return (
      <div
        className="square"
        style={{ backgroundColor: this.getBackgroundColor() }}
      >
        <button
          style={{ backgroundImage: 'url(' + this.getBgPng() + ')' }}
          onClick={() => {this.props.handleClick(this.props.tag)} }
        ></button>
      </div>
    );
  }
}

export default Square;
