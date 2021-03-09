import { combineReducers } from "redux";
import billingReducer from "./billingReducer";


export default combineReducers({
  codes: billingReducer
});
