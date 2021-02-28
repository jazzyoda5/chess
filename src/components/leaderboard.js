import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
  paper: {
    backgroundColor: "rgb(60, 60, 60)",
    padding: "1rem",
    maxWidth: "600px",
    borderRadius: "6px",
    borderColor: "rgb(100, 100, 100)",
    borderStyle: "solid",
    borderWidth: "1px",
    textAlign: "center",
    outline: "none",
  },
}));

export default function LeaderboardModal(props) {
  const classes = useStyles();
  const [lb_data, set_lb_data] = useState(null);

  /*
  useEffect(() => {
      getLeaderboardData();
  }, []);

  const getLeaderboardData = async () => {

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/lb_data`,
        config
      );
      console.log("res.data: ", res.data);


    } catch (err) {
      console.log("login error: ".err);
    }
  };
  */
  return (
    <div>
      <Modal
        aria-labelledby="leaderboard-modal"
        className={classes.modal}
        open={props.openLeaderboard}
        onClose={props.handleCloseLb}
      >

          <Box className={classes.paper}>
          <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell align="right">Wins</TableCell>
            <TableCell align="right">Draws</TableCell>
            <TableCell align="right">Losses</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {(lb_data) ? 
            lb_data.map((user) => (
                <p>user</p>
            )) : null
        }
        </TableBody>
      </Table>
    </TableContainer>
          </Box>

      </Modal>
    </div>
  );
}