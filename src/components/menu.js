import React from 'react';
import '../static/menu.css';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


function Menu(props) {

    return (
        <div className="main-menu">
            <ul>
                <li>
                    <Button
                    variant="contained"
                    href="#"
                    className="menu-but"
                    >
                        Offline 2-Player Game 
                    </Button>
                </li>
                <li>
                    <Button
                    variant="contained"
                    href="/online/"
                    className="menu-but"
                    >
                        Online Game 
                    </Button>
                </li>
            </ul>
        </div>
    );
}

export default Menu;