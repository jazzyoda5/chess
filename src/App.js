import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Board from "./components/board.js";
import Menu from "./components/menu.js";
import OfflineBoard from './components/offline_board.js'
import "fontsource-roboto";
import Typography from '@material-ui/core/Typography';

function App(props) {
  console.log(process.env);
  return (
    <div className="App">
      <Typography variant="h2" component="h2" gutterBottom>
        Chess
      </Typography>
      <Router>
        <Switch>
          <Route path="/offline">
            <OfflineBoard />
          </Route>
          <Route path="/online">
            <Board />
          </Route>
          <Route path="/">
            <Menu />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
