import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

class Navbar extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static" color="inherit">
                    <Toolbar variant="dense">
                        <Typography variant="h6" color="inherit">
                            Machine Shop Reservation Maker
                    </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(Navbar);