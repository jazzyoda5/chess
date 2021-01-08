import React from "react";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import bKn from "../static/pawns/bKn.png";
import bQ from "../static/pawns/bQ.png";
import bR from "../static/pawns/bR.png";
import bB from "../static/pawns/bB.png";
import wB from "../static/pawns/wB.png";
import wKn from "../static/pawns/wKn.png";
import wQ from "../static/pawns/wQ.png";
import wR from "../static/pawns/wR.png";


export default function PawnDialog(props) {
  const { open, color, switchPawn, data } = props;

  let black_pngs = {'bB': bB, 'bKn': bKn, 'bQ': bQ, 'bR': bR};
  let white_pngs = {'wB': wB, 'wKnW': wKn, 'wQ': wQ, 'wR': wR};

  if (color === 'w') {
      var pngs = white_pngs;
  } else {
      pngs = black_pngs;
  }

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={open}
      className="pawn-dialog"
    >
      <DialogTitle style={{ backgroundColor: 'rgb(60, 60, 60)', color: 'white' }} id="simple-dialog-title">Choose a Pawn</DialogTitle>
      <List style={{ backgroundColor: 'rgb(60, 60, 60)' }}>
            {Object.keys(pngs).map((key, val) => {
                return (
                    <ListItem style={{ 
                        width: '60px',
                        height: '60px',
                        margin: 'auto',
                        padding: '0'
                    }}>
                        <Button
                            className="pawn-dialog-but"
                            style={{ backgroundImage: "url(" + pngs[key] + ")" }}
                            // Data[0] is x
                            // Data[1] is y
                            // data[2] is the pawn
                            onClick={() => {switchPawn(data[0], data[1], key)}}
                        ></Button>
                    </ListItem>
                );
            })}
      </List>
    </Dialog>
  );
}


