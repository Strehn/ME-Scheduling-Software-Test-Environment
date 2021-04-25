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

import axios from "../../axios-bookings";
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

const schedulerData = new SchedulerData(
    new moment().format(DATE_FORMAT),
    ViewTypes.Day,
    false,
    false,
    {
        displayWeekend: false,
        headerEnabled: true,
        dayCellWidth: 30,
        nonAgendaDayCellHeaderFormat: "M/D|HH:mm"
    }
);
schedulerData.localeMoment.locale("en");
schedulerData.setMinuteStep(30);

/*
    We don't know what the machine object will look like so we are guessing for now.
    In the future, we will probably call some server endpoint to get a list of machines.
*/

/*
We also don't know what the data structure will look like for reserved times on machines.
This should also come from some server call.
Assuming we get a list of reserved times on some day for some machine.
*/
const reservedTimes = {
    machineid_1: [
        {
            startTime: moment(11, "HH").toISOString(),
            endTime: moment(13, "HH").toISOString()
        },
        {
            startTime: moment(17, "HH").toISOString(),
            endTime: moment(19, "HH").toISOString()
        }
    ],
    machineid_2: [
        {
            startTime: moment(14, "HH").toISOString(),
            endTime: moment(15, "HH").toISOString()
        }
    ]
};



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



    }

    submitReservation(code) {
        const reservation = {
            user: this.props.auth0.user.name,
            date: this.props.resDate.format('MM-DD-YYYY'),
            start: this.state.startTime,
            end: this.state.endTime,
            machine: this.state.machine,
            billingCode: code,
            grad: this.state.gradName
        };
        this.props.createReservation(reservation);
        this.setState({
            refresh: true
        });
    }

    forceRefresh() {
        window.location.reload();
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
        console.log(e.target.id, e.target.value)
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.codes.success && nextProps.codes.codes._id !== undefined) {
            this.submitReservation(nextProps.codes.codes._id);
        }

      if (this.state.refresh) {
            window.confirm("Reservation Complete");
            this.forceRefresh();
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
                    <option key={i} value={item.name}>{item.name}</option>
                )
            }, this);

        var curr = new Date();
        curr.setDate(curr.getDate());
        var defaultdate = curr.toISOString().substr(0,10);

        const { errors } = this.state;
        const { classes } = this.props;


        return (
            <div>
            <h3>Reservation Form</h3>
            <form noValidate onSubmit={this.onSubmit}>
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
                id="machine"
                onChange={this.onChange}
                value={this.state.machine}
            >
            <option disabled selected value>--Please choose an option--</option>
              {machineList}
              </select>
              </div>
              <div className="reservationrow">
                  <div>Start Time:</div>
                  <input
                      id="startTime"
                      type="time"
                      min="09:00:00"
                      max="18.30:00"
                      onChange={this.onChange}
                      value={this.state.startTime}
                  />
              </div>
              <div className="reservationrow">
                  <div>End Time:</div>
                  <input
                      id="endTime"
                      type="time"
                      min="09:30:00"
                      max="19:00:00"
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
              <Button size="small" variant="contained" color="secondary" type="submit">Create Reservation</Button>
              </form>
                <MachineScheduler startHour={7} endHour={20} machines={machines} reservedTimes={reservedTimes} />

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
    connect(mapStateToProps, { getMachines, findCode, createReservation })
)(withAuth0(CalendarScheduler));
