import React, { useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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
  textField: {
    width: "100%",
    marginBottom: "2rem",
    color: "white",
  },
  confirmButton: {
    backgroundColor: "rgb(80, 80, 80)",
  },
  input: {
    color: "white",
  },
}));

export default function RegisterModal(props) {
  const classes = useStyles();
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    if (passwordInput !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ usernameInput, passwordInput });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/register`,
        body,
        config
      );
      console.log("res.data: ", res.data);

      if (res.data.success) {
        props.setIsLoggedin(true);
        props.setUsername(usernameInput);
        props.handleCloseRegister();
      } 
      else if (res.data.error) {
        setError(res.data.error);
      }
    } catch (err) {
      console.log("login error: ".err);
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="register-modal"
        className={classes.modal}
        open={props.openRegister}
        onClose={props.handleCloseRegister}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.openRegister}>
          <Box className={classes.paper}>
            <form>
              <TextField
                className={classes.textField}
                id="filled-basic"
                label="Username"
                variant="filled"
                InputProps={{ className: classes.input }}
                InputLabelProps={{
                  style: { color: "rgb(225, 226, 230)" },
                }}
                onChange={(event) => {
                  setUsernameInput(event.target.value);
                }}
              />
              <TextField
                className={classes.textField}
                id="password"
                label="Password"
                variant="filled"
                type="password"
                InputProps={{ className: classes.input }}
                InputLabelProps={{
                  style: { color: "rgb(225, 226, 230)" },
                }}
                onChange={(event) => {
                  setPasswordInput(event.target.value);
                }}
              />
              <TextField
                className={classes.textField}
                id="confirm-password"
                label="Confirm Password"
                variant="filled"
                type="password"
                InputProps={{ className: classes.input }}
                InputLabelProps={{
                  style: { color: "rgb(225, 226, 230)" },
                }}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
              />
              {(error) ?
              <Typography variant='h5' style={{ color: '#eb5534', paddingBottom: '1rem' }}>
                { error }
              </Typography> : null
              }
              <Button
                variant="contained"
                className={classes.button}
                onClick={() => handleRegister()}
              >
                Create Account
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
