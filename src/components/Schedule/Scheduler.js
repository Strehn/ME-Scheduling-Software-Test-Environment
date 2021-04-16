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

    render() {
        const { viewModel } = this.state;

        let schedulerData = this.state.viewModel;
        schedulerData.setResources(this.props.rooms);

        return (
            <div>
                <ReservationForm/>
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

export default DragDropContext(CalendarScheduler);
