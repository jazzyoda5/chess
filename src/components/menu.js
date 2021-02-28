import React, { useState } from "react";
import axios from 'axios';
import "../static/menu.css";
import RegisterModal from "./register";
import LoginModal from "./login";
import LeaderboardModal from "./leaderboard";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

function Menu(props) {
  const [openRegister, setOpenRegister] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openLeaderboard, setOpenLeaderboard] = useState(false);

  const handleOpenRegister = () => {
    setOpenRegister(true);
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  const handleOpenLogin = () => {
    setOpenLogin(true);
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const handleOpenLb = () => {
    setOpenLeaderboard(true);
  };

  const handleCloseLb = () => {
    setOpenLeaderboard(false);
  };

  const handleLogout = async () => {
    const config = {
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/api/logout`, config);

      if (res.data.success) {
          props.setIsLoggedin(false);
          props.setUsername(null);
      }
    } catch (err) {
        console.log(err);
    



    }
  }

  return (
    <div className="main-menu">
      {props.isLoggedin && props.username ? (
        <Typography variant="h4" component="h4" gutterBottom style={{
          backgroundColor: 'rgb(50, 50, 50)',
          margin: '1rem',
          padding: '1rem',
          borderRadius: '6px',
          borderRadius: "6px",
          borderColor: "rgb(100, 100, 100)",
          borderStyle: "solid",
          borderWidth: "1px",
        }}>
          Welcome, {props.username}
        </Typography>
      ) : null}
      <ul>
        {props.isLoggedin === false ? (
          <div>
            <li>
              <Button
                variant="contained"
                onClick={() => handleOpenRegister()}
                style={{ backgroundColor: "rgb(200, 200, 200)", width: '100%', maxWidth: '250px' }}
              >
                Create an Account
              </Button>
            </li>
            <li>
              <Button
                variant="contained"
                onClick={() => handleOpenLogin()}
                style={{ backgroundColor: "rgb(200, 200, 200)", width: '100%', maxWidth: '250px' }}
              >
                Login
              </Button>
            </li>
          </div>
        ) : (
          <li>
            <Button
              variant="contained"
              style={{ backgroundColor: "rgb(200, 200, 200)", width: '100%', maxWidth: '250px' }}
              onClick={() => handleLogout()}
            >
              Logout
            </Button>
          </li>
        )}
        <li>
          <Button
            variant="contained"
            className="menu-but"
            component={Link}
            to={"/offline"}
          >
            PLAY THE COMPUTER
          </Button>
        </li>
        <li>
          <Button
            variant="contained"
            className="menu-but"
            component={Link}
            to={"/twoplayer-offline"}
            style={{ marginBottom: '1rem' }}
          >
            Offline 2-Player Game
          </Button>
        </li>
        <li>
          <hr style={{ borderColor: 'rgb(130, 130, 130)', width: '90%' }}></hr>
        </li>
        
        <li>
        <Typography variant="body1" style={{ paddingBottom: "0.5rem" }}>
            Login Required
          </Typography>
          <Button
            variant="contained"
            className="menu-but"
            component={Link}
            to={"/online"}
          >
            FIND AN OPPONENT
          </Button>
        </li>
      </ul>
      <RegisterModal
        openRegister={openRegister}
        handleCloseRegister={handleCloseRegister}
        isLoggedin={props.isLoggedin}
        setIsLoggedin={props.setIsLoggedin}
        username={props.username}
        setUsername={props.setUsername}
      />
      <LoginModal
        openLogin={openLogin}
        handleCloseLogin={handleCloseLogin}
        isLoggedin={props.isLoggedin}
        setIsLoggedin={props.setIsLoggedin}
        username={props.username}
        setUsername={props.setUsername}
      />
    </div>
  );
}

export default Menu;
