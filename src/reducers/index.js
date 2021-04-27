import { combineReducers } from "redux";
import billingReducer from "./billingReducer";
import machineReducer from "./machineReducer";
import upcomingResReducer from './upcomingResReducer';
import pastResReducer from './pastResReducer';
import schedulerReducer from "./schedulerReducer";


export default combineReducers({
  codes: billingReducer,
  machines: machineReducer,
  upcomingreservations: upcomingResReducer,
  pastreservations: pastResReducer,
  schedulerData: schedulerReducer
});
