import { combineReducers } from "redux";
import SettingsReducer from "./setting";
import TempSettingsReducer from "./tempsetting";

const rootReducer = combineReducers({
  setting: SettingsReducer,
  tempSetting: TempSettingsReducer,
});

export default rootReducer;
