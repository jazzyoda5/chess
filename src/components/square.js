import React from "react";

class Square extends React.Component {
  constructor(props) {
    super(props);

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

  render() {
    return (
      <div
        className="square"
        style={{ backgroundColor: this.getBackgroundColor() }}
      >
        <button>{this.props.value}</button>
      </div>
    );
  }
}

export default Square;
