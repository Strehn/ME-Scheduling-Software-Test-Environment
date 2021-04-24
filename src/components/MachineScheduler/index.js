import React from "react";
import moment from "moment";
import {ReservationDataContext} from "../../views/ExternalApi";

import "./styles.css";

import { getMachines } from '../../actions/machineActions';
import { compose } from 'redux';
import { connect } from "react-redux";

/*

machines = [
    {
        id: "machineid_1234"
        name: "Lathe 1"
    },
    {
        id: "machineid_1234"
        name: "Lathe 2"
    },
]

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

startHour: an integer that represents the earliest hour in the day someone can schedule.
endHour: an integer that represents the latest hour in the day someone can schedule.
day: the current day that the schedule represents?
*/

const MachineScheduler = ({startHour, endHour, day}) => {
    const reservationDataObj = React.useContext(ReservationDataContext);
    const reservedTimes = reservationDataObj.reservationData;
    const machines = [
        {
            id: "lathe_1",
            name: "Lathe 1"
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
    ];
    const rowHeight = 50;
    const cellStyles = { height: rowHeight };
    const hours = [];

    for (let hour = startHour; hour <= endHour; hour++) {
        let ampm = "am";
        if (hour >= 12) {
            ampm = "pm";
        }
        // this just bumps the mod operater to be 1 based instead of 0.
        const ampmHour = (hour - 1) % 12 + 1;

        hours.push(`${ampmHour}:00 ${ampm}`)
    }

    // const myArr = [1,2,3,4];
    // myArr.map(x => x * 2); // [2, 4, 6, 8]
    // [""].concat([1,2,3,4]) // ["", 1, 2, 3, 4]

    // const hoursColumn = [""].concat(hours);
    // const machineColumn = Array.from({ length: hours.length });

    // classnames("hourRow", { conditionalClass: shouldApply }) === "hourRow conditionalClass"

    return (
        <div className="machineSchedulerContainer">
            <div className="schedulerColumn">
                <div className="hourRow horiCenter" style={cellStyles} />
                {hours.map(ampmHour => <div className="hourRow horiCenter" style={cellStyles} key={ampmHour}>
                    {ampmHour}
                </div>)}
            </div>
            {machines.map(machine => <div className="schedulerColumn" key={machine.id}>
                <div className="hourRow vertCenter horiCenter" style={cellStyles}>
                    {machine.name}
                </div>
                <div className="timeContainer">
                    {(reservedTimes[machine.id] || []).map(reservedTime => {
                        const msBetweenReserveStartTimeAndReserveTime =
                            moment(reservedTime.startTime).valueOf() - moment(startHour, "HH").valueOf();
                        const hoursAfterStartHour = msBetweenReserveStartTimeAndReserveTime / 1000 / 60 / 60;
                        const boxPositionY = hoursAfterStartHour * rowHeight;
                        const timeBetweenStartAndEnd =
                            (moment(reservedTime.endTime).valueOf() - moment(reservedTime.startTime).valueOf());
                        const boxHeight = rowHeight * timeBetweenStartAndEnd / 1000 / 60 / 60;


                        return (
                            <div className="reservedTime" style={{
                                top: boxPositionY,
                                height: `${boxHeight}px`
                            }} />
                        );
                    })}
                    {hours.map(
                        (hour, idx) => <div className="hourRow vertCenter horiCenter" style={cellStyles} key={idx} />
                    )}
                </div>
            </div>)}
        </div>
    );
}

const mapStateToProps = state => ({
    machines: state.machines
});

export default compose(
  connect(mapStateToProps, { getMachines })
)(MachineScheduler);
