import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { DialogContent, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

// Dialog that opens on checkmate
export default function CheckmateDialog(props) {
  const { open, winner, handleExit } = props;

  // Returns the winner
  const getWinner = () => {
    if (winner === "w") {
      var temp = "White";
    } else if (winner === "b") {
      temp = "Black";
    } else {
      return winner;
    }
    return temp;
  };

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={open}
      className="checkmate-dialog"
    >
      <DialogTitle
        style={{ backgroundColor: "rgb(60, 60, 60)", color: "white" }}
        id="simple-dialog-title"
      >
        <strong>Checkmate! </strong>
        {getWinner()} has won!
      </DialogTitle>
      <DialogContent
        style={{
          backgroundColor: "rgb(60, 60, 60)",
        }}
      >
        <Button
          onClick={() => {
            handleExit();
          }}
          component={Link}
          to={"/"}
          style={{
            backgroundColor: "rgb(50, 50, 50)",
            color: "white",
            width: "100%",
            marginBottom: "10px",
          }}
        >
          Exit
        </Button>
      </DialogContent>
    </Dialog>
  );
}
