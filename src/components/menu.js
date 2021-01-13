import React from 'react';
import '../static/menu.css';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';


function Menu(props) {

    return (
        <div className="main-menu">
            <ul>
                <li>
                    <Button
                    variant="contained"
                    className="menu-but"
                    component={Link}
                    to={'/offline'}
                    >
                        PLAY THE COMPUTER 
                    </Button>
                </li>
                <li>
                    <Button
                    variant="contained"
                    className="menu-but"
                    component={Link}
                    to={'/twoplayer-offline'}
                    >
                        Offline 2-Player Game 
                    </Button>
                </li>
                <li>
                    <Button
                    variant="contained"
                    className="menu-but"
                    component={Link}
                    to={'/online'}
                    >
                        FIND AN OPPONENT
                    </Button>
                </li>
            </ul>
        </div>
    );
}

export default Menu;