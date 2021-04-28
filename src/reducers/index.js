import { combineReducers } from "redux";
import billingReducer from "./billingReducer";
import errorReducer from "./errorReducer";
import machineReducer from "./machineReducer";
import upcomingResReducer from './upcomingResReducer';
import pastResReducer from './pastResReducer';
import schedulerReducer from "./schedulerReducer";


export default combineReducers({
  codes: billingReducer,
  errors: errorReducer,
  machines: machineReducer,
  upcomingreservations: upcomingResReducer,
  pastreservations: pastResReducer,
  schedulerData: schedulerReducer
});
