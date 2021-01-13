import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { DialogContent, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function ChooseColorDialog(props) {
  const { open, handleColorChoice } = props;

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
        Choose your color
      </DialogTitle>
      <DialogContent
        style={{
          backgroundColor: "rgb(60, 60, 60)",
        }}
      >
        <Button
        variant="contained"
        style={{
            display: 'flex',
            margin: 'auto',
            marginBottom: '16px'
        }}
        onClick={() => {
            handleColorChoice('White')
        }}
        >White</Button>
        <Button
        variant="contained"
        style={{
            display: 'flex',
            margin: 'auto',
            marginBottom: '16px',
            backgroundColor: 'black',
            color: 'white'
        }}
        onClick={() => {
            handleColorChoice('Black')
        }}
        >Black</Button>
      </DialogContent>
    </Dialog>
  );
}