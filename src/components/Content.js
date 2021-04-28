import React, { Component } from "react";
import { Grid } from '@material-ui/core';
import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from "./Calander";
import ViewOnlyCalendar from '../components/ReservationOverview/ViewOnlyCalendar';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  dropdown: {
    justifyContent: 'space-between',
    padding: theme.spacing(4)
  },
  button: {
    justifyContent: 'flex-start',
    padding: theme.spacing(4)
  },
  calendar: {
    justifyContent: 'center'
  }
});

class Content extends Component {
  render() {

      const { classes } = this.props;

    return (
      <div className="text-center hero my-5">
        <h2 className="text-center hero my-5">Machine Availability</h2>
        <Grid className={classes.calendar} container item xs={12}>
        <ViewOnlyCalendar />
        </Grid>
      </div>
    );
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
