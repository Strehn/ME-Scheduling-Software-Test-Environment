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
import ReservationForm from "../Reservations/ReservationForm";

import { getMachines } from '../../actions/machineActions';
import PropTypes from "prop-types";
import { compose } from 'redux';
import { connect } from "react-redux";

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
const machines = [
    {
        id: "lathe_1",
        name: "Lathe 1",
    },
    {
        id: "lathe_2",
        name: "Lathe 2"
    },
    {
        id: "computer",
        name: "Computer"
    },
    {
        id: "printer",
        name: "3D Printer"
    },
    {
        id: "remote_login_pc",
        name: "Remote Login PC"
    },
    {
        id: "sindoh",
        name: "Sindoh 1"
    }
]

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
    state = {
        viewModel: schedulerData,
        showBookingDialog: false
    };

    handleClickOpen = () => {
        // this.setState({ showBookingDialog: true });
        this.setState(prevState => {
            return { showBookingDialog: !prevState.showBookingDialog };
        });
    };

    handleClose = () => {
        this.setState({ showBookingDialog: false });
    };

    componentDidMount() {
        this.props.getMachines();
    }

    storeMachine = e => {
    this.setState({ value: e.target.value });
    }

    storeResDate = e => {
    this.setState({ value: e.target.value });
    }

    storeStartTime = e => {
    this.setState({ value: e.target.value });
    }

    storeEndTime = e => {
    this.setState({ value: e.target.value });
    }

    storeBillingCode = e => {
    this.setState({ value: e.target.value });
    }

    storeGradName = e => {
    this.setState({ value: e.target.value });
    }

    render() {
        const { viewModel } = this.state;

        let schedulerData = this.state.viewModel;
        schedulerData.setResources(this.props.rooms);

        const { machines, getMachines } = this.props.machines;

        let machineList = machines.length > 0
            && machines.map((item, i) => {
                return (
                    <option key={i} value={item.id}>{item.name}</option>
                )
            }, this);

        var curr = new Date();
        curr.setDate(curr.getDate());
        var defaultdate = curr.toISOString().substr(0,10);

        return (
            <div>
            <h3>Reservation Form</h3>
            <div className="reservationrow">
            <div>Reservation Date:</div>
            <input
                type="date"
                defaultValue={defaultdate}
                min={defaultdate}
                onChange={this.storeResDate}
            />
              </div>
            <div className="reservationrow">
            <div>Machine:</div>
            <select
                onChange={this.storeMachine}
            >
            <option disabled selected value>--Please choose an option--</option>
              {machineList}
              </select>
              </div>
              <div className="reservationrow">
                  <div>Start Time:</div>
                  <input
                      type="time"
                      min="09:00"
                      max="18.30"
                      onChange={this.storeStartTime}
                  />
              </div>
              <div className="reservationrow">
                  <div>End Time:</div>
                  <input
                      type="time"
                      min="09:30"
                      max="19:00"
                      onChange={this.storeEndTime}
                  />
              </div>
              <div className="reservationrow">
                  <div>Grad Student Name:</div>
                  <input
                      type="text"
                      onChange={this.storeGradName}
                  />
              </div>
              <div className="reservationrow">
                  <div>Billing Code:</div>
                  <input
                      type="text"
                      onChange={this.storeBillingCode}
                  />
              </div>
              <button type="button" >Create Reservation</button>
                // <ReservationForm/>
                <MachineScheduler startHour={7} endHour={20} machines={machines} reservedTimes={reservedTimes} />

                {/* <Scheduler
                    schedulerData={viewModel}
                    prevClick={this.prevClick}
                    nextClick={this.nextClick}
                    onSelectDate={this.onSelectDate}
                    newEvent={this.newEvent}
                />
                {this.state.showBookingDialog === true && (
                    <BookingDialog open onClose={this.handleClose} />
                )} */}
            </div>
        );
    }

    newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
        this.setState({
            showBookingDialog: true
        });
	/*
         if (window.confirm(`Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`)) {
             let newFreshId = 0;
             schedulerData.events.forEach((item) => {
                 if (item.id >= newFreshId)
                     newFreshId = item.id + 1;
             });
             let newEvent = {
                 id: newFreshId,
                 title: 'New event you just created',
                 start: start,
                 end: end,
                 resourceId: slotId,
                 bgColor: 'purple'
             }
             schedulerData.addEvent(newEvent);
             this.setState({
                 viewModel: schedulerData
             })
             const booking = {
                 id: newFreshId,
                 title: 'New event you just created',
                 start: start,
                 end: end,
                 resourceId: slotId,
                 customer: {
                     name: 'Joey',
                     ic: 'S12345678C',
                     mobile: '98765432',
                 }
             }
             axios.post('/bookings.json', booking)
                 .then(response => console.log(response))
                 .catch(error => console.log("hello"));
         }
	 */
    };

    prevClick = schedulerData => {
        schedulerData.prev();
        // schedulerData.setEvents(DemoData.events);
        this.setState({
            viewModel: schedulerData
        });
    };

    nextClick = schedulerData => {
        schedulerData.next();
        // schedulerData.setEvents(DemoData.events);
        this.setState({
            viewModel: schedulerData
        });
    };

    onSelectDate = (schedulerData, date) => {
        schedulerData.setDate(date);
        // schedulerData.setEvents(DemoData.events);
        this.setState({
            viewModel: schedulerData
        });
    };
}

CalendarScheduler.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    machines: state.machines
});

// export default DragDropContext(CalendarScheduler)
export default compose(
    connect(mapStateToProps, { getMachines })
)(CalendarScheduler);
