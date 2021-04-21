import { combineReducers } from "redux";
import billingReducer from "./billingReducer";
import machineReducer from "./machineReducer";


export default combineReducers({
  codes: billingReducer,
  machines: machineReducer
});
