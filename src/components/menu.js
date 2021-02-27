import React, { useState } from "react";
import "../static/menu.css";
import RegisterModal from "./register";
import LoginModal from "./login";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

function Menu(props) {
  const [openRegister, setOpenRegister] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

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

  return (
    <div className="main-menu">
      <ul>
        <li>
          <Typography variant="h5" style={{ paddingBottom: "1rem" }}>
            Online
          </Typography>
        </li>

        {props.isLoggedin === false ? (
          <div>
            <li>
              <Button
                variant="contained"
                onClick={() => handleOpenRegister()}
                style={{ backgroundColor: "white" }}
              >
                Create an Account
              </Button>
            </li>
            <li>
              <Button
                variant="contained"
                onClick={() => handleOpenLogin()}
                style={{ backgroundColor: "white" }}
              >
                Login
              </Button>
            </li>
          </div>
        ) : (
          <li>
            <Button variant="contained" style={{ backgroundColor: "white" }}>
              Logout
            </Button>
          </li>
        )}

        <li>
          <Button
            variant="contained"
            className="menu-but"
            component={Link}
            to={"/online"}
          >
            FIND AN OPPONENT
          </Button>
        </li>
        <li>
          <Button
            variant="contained"
            className="menu-but"
            component={Link}
            to={"/leaderboard"}
          >
            LEADERBOARD
          </Button>
        </li>
        <li>
          <Typography variant="h5" style={{ padding: "1rem" }}>
            Offline
          </Typography>
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
          >
            Offline 2-Player Game
          </Button>
        </li>
      </ul>
      <RegisterModal
        openRegister={openRegister}
        handleCloseRegister={handleCloseRegister}
      />
      <LoginModal openLogin={openLogin} handleCloseLogin={handleCloseLogin} />
    </div>
  );
}

export default Menu;
