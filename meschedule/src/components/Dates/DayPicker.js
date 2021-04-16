import React, { Component } from 'react'
import { DayPickerSingleDateController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment'


class CalendarDayPicker extends Component {
    state = {

    }

    render() {
        return (
            <div>
                <DayPickerSingleDateController
                    numberOfMonths={1}
                    date={this.props.date}
                    onDateChange={this.props.onDateChange}
                    hideKeyboardShortcutsPanel={true}
                    enableOutsideDays={true}
                />
            </div>
        )
    }
}

export default CalendarDayPicker;
