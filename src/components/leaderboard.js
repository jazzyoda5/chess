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
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

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
    width: '100%',
    maxWidth: "700px",
    borderRadius: "6px",
    borderColor: "rgb(100, 100, 100)",
    borderStyle: "solid",
    borderWidth: "1px",
    textAlign: "center",
    outline: "none",
  },
  table: {
    backgroundColor: 'rgb(35, 35, 35)',
    color: 'white',
  },
  tableCell: {
    color: 'white',
    borderBottomColor: 'rgb(70, 70, 70)'
  }
}));

export default function LeaderboardModal(props) {
  const classes = useStyles();
  // Leaderboard Data
  const [lb_data, set_lb_data] = useState([]);

  useEffect(() => {
    if (props.openLeaderboard === true && lb_data.length < 1) {
      getLeaderboardData();
    }
  }, [lb_data, props.openLeaderboard]);

  const getLeaderboardData = async () => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/leaderboard_data`,
        config
      );
      if (res.data.success) {
        set_lb_data(res.data.data);
      }
    } catch (err) {
      console.log("login error: ".err);
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="leaderboard-modal"
        className={classes.modal}
        open={props.openLeaderboard}
        onClose={props.handleCloseLb}
      >
        <Box className={classes.paper}>
          <TableContainer style={{ backgroundColor: 'rgb(42, 42, 42)'}} component={Paper}>
          <Typography variant='h5' style={{
                margin: 'auto',
                padding: '1rem',
                color: 'white'
              }}>
                Online Leaderboard
              </Typography>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>

                <TableRow>
                  <TableCell className={classes.tableCell}><strong>Player</strong></TableCell>
                  <TableCell align="right"  className={classes.tableCell}><strong>Wins</strong></TableCell>
                  <TableCell align="right" className={classes.tableCell}><strong>Draws</strong></TableCell>
                  <TableCell align="right" className={classes.tableCell}><strong>Losses</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lb_data.map((row) => (
                  <TableRow key={row.username}>
                    <TableCell component='th' scope='row' className={classes.tableCell}>
                      {row.username}
                    </TableCell>
                    <TableCell align="right" className={classes.tableCell}>{row.wins}</TableCell>
                    <TableCell align="right" className={classes.tableCell}>{row.draws}</TableCell>
                    <TableCell align="right" className={classes.tableCell}>{row.loses}</TableCell>
                  </TableRow>
                ))} 
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </div>
  );
}
