import React, { Component } from "react";

import Scheduler, {
    SchedulerData,
    ViewTypes,
    DATE_FORMAT
} from "react-big-scheduler";
import "react-big-scheduler/lib/css/style.css";
import DragDropContext from "./withDnDContext";
import moment from "moment";

import axios from "../../axios-bookings";
import BookingDialog from "./BookingDialog";

const schedulerData = new SchedulerData(
    new moment().format(DATE_FORMAT),
    ViewTypes.Day,
    false,
    false,
    {
        displayWeekend: false,
        headerEnabled: true,
        dayCellWidth: 30,
        nonAgendaDayCellHeaderFormat: "D/M|HH:mm"
    }
);
schedulerData.localeMoment.locale("en");
schedulerData.setMinuteStep(30);

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
                <Scheduler
                    schedulerData={viewModel}
                    prevClick={this.prevClick}
                    nextClick={this.nextClick}
                    onSelectDate={this.onSelectDate}
                    newEvent={this.newEvent}
                />
                {this.state.showBookingDialog === true && (
                    <BookingDialog open onClose={this.handleClose} />
                )}
            </div>
        );
    }

    newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
        this.setState({
            showBookingDialog: true
        });
        // if (window.confirm(`Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`)) {
        //     let newFreshId = 0;
        //     schedulerData.events.forEach((item) => {
        //         if (item.id >= newFreshId)
        //             newFreshId = item.id + 1;
        //     });
        //     let newEvent = {
        //         id: newFreshId,
        //         title: 'New event you just created',
        //         start: start,
        //         end: end,
        //         resourceId: slotId,
        //         bgColor: 'purple'
        //     }
        //     schedulerData.addEvent(newEvent);
        //     this.setState({
        //         viewModel: schedulerData
        //     })
        //     const booking = {
        //         id: newFreshId,
        //         title: 'New event you just created',
        //         start: start,
        //         end: end,
        //         resourceId: slotId,
        //         customer: {
        //             name: 'Joey',
        //             ic: 'S12345678C',
        //             mobile: '98765432',
        //         }
        //     }
        //     axios.post('/bookings.json', booking)
        //         .then(response => console.log(response))
        //         .catch(error => console.log("hello"));
        // }
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
