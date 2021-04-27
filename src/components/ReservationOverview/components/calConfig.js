import { ViewTypes } from 'react-big-scheduler';

export default {
    startResizable: false,
    endResizable: false,
    movable: false,
    creatable: false,
    schedulerWidth: '90%',
    checkConflict: true,
    resourceName: 'Machine',
    minuteStep: 30,

    views: [
        { viewName: 'Day', viewType: ViewTypes.Day, showAgenda: false, isEventPerspective: false },
    ]
}
