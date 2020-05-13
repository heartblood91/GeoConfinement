import {
  SET_SETTING,
  SET_LOCATION,
  SET_ADDRESS,
  SET_IS_PRESS,
  SYNCHRO_SETTING_TEMP,
} from "./action-types";

export const setCoord = (geocode, actionTypeBrute) => {
  return function (dispatch) {
    const actionType =
      actionTypeBrute === "location" ? SET_LOCATION : SET_ADDRESS;

    dispatch({ type: actionType, payload: geocode });
  };
};

export const handleChangeSettings = (name, type, inputValue) => {
  const actionType = type === "isPress" ? SET_IS_PRESS : SET_SETTING;

  return function (dispatch) {
    dispatch({ type: actionType, payload: { name, type, inputValue } });
  };
};

export const syncroTempToSettings = (tempSetting) => {
  return function (dispatch) {
    dispatch({ type: SYNCHRO_SETTING_TEMP, payload: { ...tempSetting } });
  };
};
