import { combineReducers } from "redux";
import ParamsReducer from "./params";

const rootReducer = combineReducers({
  params: ParamsReducer,
});

export default rootReducer;
