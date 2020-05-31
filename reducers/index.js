import { combineReducers } from "redux";
import SettingsReducer from "./setting"; // Gère les paramètres principales après un passage sur la page setting
import TempSettingsReducer from "./tempsetting"; // Gère les paramètres temporaires sur la page setting

const rootReducer = combineReducers({
  setting: SettingsReducer,
  tempSetting: TempSettingsReducer,
});

export default rootReducer;
