import { combineReducers } from "redux";
import SettingsReducer from "./setting";

const rootReducer = combineReducers({
  setting: SettingsReducer,
});

export default rootReducer;
