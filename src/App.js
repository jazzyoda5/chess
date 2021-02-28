import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Board from "./components/board.js";
import Menu from "./components/menu.js";
import OfflineBoard from "./components/offline_board.js";
import PrivateRoute from "./components/private_route";
import "fontsource-roboto";
import Typography from "@material-ui/core/Typography";

function App(props) {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [username, setUsername] = useState(null);

  return (
    <div className="App">
      <Typography variant="h2" component="h2" gutterBottom>
        Chess
      </Typography>
      <Router>
        <Switch>
          <Route path="/offline">
            <OfflineBoard mode={"1player"} />
          </Route>
          <Route path="/twoplayer-offline">
            <OfflineBoard mode={"2player"} />
          </Route>
          <PrivateRoute
            exact
            path="/online"
            component={Board}
            isLoggedin={isLoggedin}
            username={username}
          />
          <Route path="/">
            <Menu
              isLoggedin={isLoggedin}
              setIsLoggedin={setIsLoggedin}
              username={username}
              setUsername={setUsername}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
