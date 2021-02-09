import React, { Component } from 'react'
import moment from 'moment'
import axios from '../axios-bookings';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import DayPicker from '../components/Dates/DayPicker';
import Scheduler from '../components/Schedule/Scheduler';

const styles = theme => ({
    root: {
        flexGrow: 1,
        paddingTop: theme.spacing.unit * 2,
    },
    padding: {
        padding: theme.spacing.unit * 2,
    }
});

class RoomAvailability extends Component {
    state = {
        date: new moment(),
        rooms: [],
    }

    componentWillMount() {
        axios.get('/rooms.json')
            .then(response => {
                // console.log(response.data);
                const fetchedRooms = [];
                for (let key in response.data) {
                    fetchedRooms.push({
                        id: key,
                        name: response.data[key]
                    })
                }
                // console.log(fetchedRooms);
                this.setState({ rooms: fetchedRooms });
                console.log(this.state.rooms);
            });
    }

    render() {
        const { classes } = this.props;
        // console.log(this.state.date);

        return (
            <div className={classes.root}>
                {/* <Grid container={40} justify="center" alignItems="flex-start">
                    {/* <Grid item xs={3} direction="column">
                        <Grid item className={classes.padding}>
                            <DayPicker
                                date={this.state.date}
                                onDateChange={this.onDateChange} />
                        </Grid>
                        <Grid item>
                            <h1>Filter</h1>
                        </Grid>
                    </Grid>
                    <Grid item xs={9} className={classes.padding}> */}
                {/* <Scheduler 
                            date={this.state.date}
                            rooms={this.state.rooms}/> */}
                {/* </Grid> */}
                {/* </Grid> */}
                <Scheduler
                    date={this.state.date}
                    rooms={this.state.rooms} />
            </div>
        )
    }

    onDateChange = (date) => {
        this.setState({ date });
    }
}

export default withStyles(styles)(RoomAvailability);
