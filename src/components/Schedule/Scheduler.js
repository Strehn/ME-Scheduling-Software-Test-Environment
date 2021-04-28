import React, { Component } from "react";

import Scheduler, {
    SchedulerData,
    ViewTypes,
    DATE_FORMAT
} from "react-big-scheduler";
import "react-big-scheduler/lib/css/style.css";
import DragDropContext from "./withDnDContext";
import moment from "moment";

// import MachineScheduler from "../MachineScheduler";

import axios from 'axios';
// import BookingDialog from "./BookingDialog";
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
// import { findMachine } from '../../actions/machineActions';
import { withAuth0 } from "@auth0/auth0-react";

import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";


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
          gradName: "",
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

    // this.props.findMachine(this.state);

    this.props.findCode(this.state)

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
            resourceId: this.state.resourceId,
            machine: this.state.machine,
            billingCode: code,
            grad: this.state.gradName
        };

        this.props.createReservation(reservation);

        window.confirm("Reservation Complete. The page will refresh automatically.");

        this.forceRefresh();

    }

    forceRefresh() {
        // window.location.reload();
        setTimeout(function(){
           window.location.reload(1);
        }, 2000);
    }


    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    }

    onChangeMachine = e => {
        this.setState({ ["machine"]: e.target.value });
        this.setState({ ["resourceId"]: e.target.options.selectedIndex-1});
        this.setState({ ["gradRequired"]: this.props.machines.machines[e.target.options.selectedIndex-1].gradrequired });
    }

    onStartTimeChange = (e) => {
        this.setState({...this.state, startTime: e.format("HH:mm")});
    };

    onEndTimeChange = (e) => {
        this.setState({...this.state, endTime: e.format("HH:mm")});
    };

    componentWillReceiveProps(nextProps) {
      console.log(nextProps.errors);

      if (nextProps.codes.success && nextProps.codes.codes._id !== undefined) {

        //Check the role of user scheduling (undergrad or admin/grad)
        let isAdmin = (this.props.auth0.user.["http://localhost:3000/roles"].includes("Admin")) || (this.props.auth0.user.["http://localhost:3000/roles"].includes("Graduate Student"));

        //Get the start time and 24 hours from current time to check for 24 hours gap
        var startmomentObj = moment(moment(this.state.resDate).format('YYYY-MM-DD') + this.state.startTime, "YYYY-MM-DDHH:mm");
        var start = startmomentObj.format('YYYY-MM-DD HH:mm:ss');
        let tomorrow = moment().add(1,'days').format('YYYY-MM-DD HH:mm:ss')

        //Check if reservation is for 24 hours ahead
        if (tomorrow > start){
          window.confirm("ERROR: Invalid Start Time. Reservations must be made 24 hours in advance.")
        }

        //Check if start time is later than 9am
        else if(this.state.startTime < "09:00" || typeof(this.state.startTime)=="undefined" || (this.state.startTime > this.state.endTime)){
          window.confirm("ERROR: Invalid Start Time. Please confirm it is after 9am and earlier than your end time.")
        }

        //Check if end time is later than 7pm
        else if(this.state.endTime > "19:00" || typeof(this.state.startTime)=="undefined"){
          window.confirm("ERROR: Invalid End Time. The machine shop closes at 7pm.")
        }

        //Check if user needs to have a graduate student name submitted
        else if(!isAdmin && (this.state.gradRequired==true) && (this.state.gradName==="")){
            window.confirm("ERROR: This machine requires a graduate student to be present. Please enter the name of a graduate student.")
        }

        //All good, proceed to submit
        else{
        this.submitReservation(nextProps.codes.codes._id, nextProps.machines.machines._id);
        }
        }

    if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }

    }

    timeConstraints = {

    minutes: {
      step: 30
    }
    }

    render() {
        const { user } = this.props.auth0;
        const { machines, getMachines } = this.props.machines;

        let machineList = machines.length > 0
            && machines.map((item, i) => {
                return (
                    <option key={item.id} value={item.name} gradreq={item.gradrequired.toString()} >{item.name}</option>
                )
            }, this);

        var defaultdate = new Date();
        var dd = String(defaultdate.getDate()).padStart(2, '0');
        var mm = String(defaultdate.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = defaultdate.getFullYear();

        defaultdate = yyyy + '-' + mm + '-' + dd;


        const { errors } = this.state;
        const { classes } = this.props;

        let gradRequired = (user.["http://localhost:3000/roles"].includes("Admin")) || (user.["http://localhost:3000/roles"].includes("Graduate Student"));



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
                onChange={this.onChangeMachine}
                value={this.state.machine}
            >
            <option disabled selected value>--Please choose an option--</option>
              {machineList}
              </select>
              </div>
              <div className="reservationrow">
              <div>Start Time:</div>
              <Datetime
                  id="startTime"
                  dateFormat={false}
                  onChange={this.onStartTimeChange}
                  timeConstraints={this.timeConstraints}
                  input={false}
               />
              </div>
              <div className="reservationrow">
              <div>End Time:</div>
              <Datetime
                  id="startTime"
                  dateFormat={false}
                  onChange={this.onEndTimeChange}
                  timeConstraints={this.timeConstraints}
                  input={false}
               />
              </div>
              {/*
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
              </div>*/}
              {!gradRequired &&(
              <div className="reservationrow">
              <TextField
                  required
                  id="gradName"
                  label="Grad Student Name"
                  onChange={this.onChange}
                  value={this.state.gradName}
              />
              </div>
            )}
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
    connect(mapStateToProps, { getMachines, findCode, createReservation })
)(withAuth0(CalendarScheduler));
