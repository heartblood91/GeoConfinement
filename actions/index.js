import { SET_SETTING, SET_LOCALISATION, SET_ADDRESS } from "./action-types";

export const setCoord = (geocode, actionTypeBrute) => {
  return function (dispatch) {
    const actionType =
      actionTypeBrute === "LOCALISATION" ? SET_LOCALISATION : SET_ADDRESS;

    dispatch({ type: actionType, payload: geocode });
  };
};

export const handleChangeSettings = (value, name) => {
  return function (dispatch) {
    dispatch({ type: SET_SETTING, payload: { [name]: value } });
  };
};
