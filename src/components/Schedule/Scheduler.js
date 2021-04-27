import React, { Component } from "react";

import Scheduler, {
    SchedulerData,
    ViewTypes,
    DATE_FORMAT
} from "react-big-scheduler";
import "react-big-scheduler/lib/css/style.css";
import DragDropContext from "./withDnDContext";
import moment from "moment";

import MachineScheduler from "../MachineScheduler";

import axios from 'axios';
import BookingDialog from "./BookingDialog";
// import ReservationForm from "../Reservations/ReservationForm";

import { getMachines } from '../../actions/machineActions';
import PropTypes from "prop-types";
import { compose } from 'redux';
import { connect } from "react-redux";
import TextField from '@material-ui/core/TextField';
import classnames from "classnames";
import { findCode } from "../../actions/billingActions";
import { createReservation } from "../../actions/upcomingResActions";
import Button from '@material-ui/core/Button';
import { findMachine } from '../../actions/machineActions';
import { withAuth0 } from "@auth0/auth0-react";

import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';


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
    },
    card: {
        margin: theme.spacing(2),
    }
});


class CalendarScheduler extends Component {

  constructor(props) {
      super(props);
      this.state = {
          newRes: [],
          grads: {},
          refresh: false,
          errors: {},
          value: []
      };
  }

    componentDidMount() {
        this.props.getMachines();

    }

    onSubmit = e => {
    e.preventDefault();

    this.props.findCode(this.state);
    this.props.findMachine(this.state);

    }


    submitReservation(code, machineref) {

        var startmomentObj = moment(moment(this.state.resDate).format('YYYY-MM-DD') + this.state.startTime, "YYYY-MM-DDHH:mm");
        var start = startmomentObj.format('YYYY-MM-DD HH:mm:ss');

        var endmomentObj = moment(moment(this.state.resDate).format('YYYY-MM-DD') + this.state.endTime, "YYYY-MM-DDHH:mm");
        var end = endmomentObj.format('YYYY-MM-DD HH:mm:ss');

        const reservation = {
            user: this.props.auth0.user.name,
            start: start,
            end: end,
            machine: machineref,
            resourceId: this.state.resourceId,
            billingCode: code,
            grad: this.state.gradName
        };

        this.props.createReservation(reservation);

        // console.log(reservation);
        window.confirm("Reservation Complete");

        this.forceRefresh();

    }

    forceRefresh() {
        window.location.reload();
    }


    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
        console.log(e.target.id, e.target.value)
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.codes.success && nextProps.codes.codes._id !== undefined && nextProps.machines.machines._id !== undefined) {
            this.submitReservation(nextProps.codes.codes._id, nextProps.machines.machines._id);


        }


      if (nextProps.errors) {
              this.setState({
                  errors: nextProps.errors
              });
          }
    }


    render() {
        const { user } = this.props.auth0;
        const { machines, getMachines } = this.props.machines;

        let machineList = machines.length > 0
            && machines.map((item, i) => {
                return (
                    <option key={i} value={item.id}>{item.name}</option>
                )
            }, this);

        var defaultdate = new Date();
        var dd = String(defaultdate.getDate()).padStart(2, '0');
        var mm = String(defaultdate.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = defaultdate.getFullYear();

        defaultdate = yyyy + '-' + mm + '-' + dd;


        const { errors } = this.state;
        const { classes } = this.props;


        return (
            <div>
            <h3>Reservation Form</h3>
            <Card className={classes.card}>
            <form noValidate onSubmit={this.onSubmit}>
            <CardContent>
            <div className="reservationrow">
            <div>Reservation Date:</div>
            <input
                id="resDate"
                type="date"
                defaultValue={defaultdate}
                min={defaultdate}
                onChange={this.onChange}
                value={this.state.resDate}
            />
              </div>
            <div className="reservationrow">
            <div>Machine:</div>
            <select
                id="resourceId"
                onChange={this.onChange}
                value={this.state.resourceId}
            >
            <option disabled selected value>--Please choose an option--</option>
              {machineList}
              </select>
              </div>
              <div className="reservationrow">
                  <div>Start Time:</div>
                  <TextField
                      id="startTime"
                      type="time"
                      onChange={this.onChange}
                      value={this.state.startTime}
                  />
              </div>
              <div className="reservationrow">
                  <div>End Time:</div>
                  <TextField
                      id="endTime"
                      type="time"
                      onChange={this.onChange}
                      value={this.state.endTime}
                  />
              </div>
              <div className="reservationrow">
              <TextField
                  required
                  id="gradName"
                  label="Grad Student Name"
                  onChange={this.onChange}
                  value={this.state.gradName}
              />
              </div>
              <div className="reservationrow">
                  <TextField
                      required
                      id="code"
                      label="Billing Code"
                      onChange={this.onChange}
                      value={this.state.code}
                      error={errors.codenotfound}
                      helperText={errors.codenotfound}
                      className={classnames("", {
                          invalid: errors.codenotfound
                      })}
                  />
              </div>
               </CardContent>
              <CardActions>
              <Button size="small" variant="contained" color="secondary" type="submit">Create Reservation</Button>
              </CardActions>
              </form>
              </Card>

            </div>
        );
    }

}

CalendarScheduler.propTypes = {
    classes: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    machines: state.machines,
    codes: state.codes,
    errors: state.errors
});

export default compose(
    withStyles(styles),
    connect(mapStateToProps, { getMachines, findCode, findMachine, createReservation })
)(withAuth0(CalendarScheduler));
