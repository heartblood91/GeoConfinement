import {
  SET_SETTING,
  SET_LOCALISATION,
  SET_ADDRESS,
  SET_IS_PRESS,
} from "./action-types";

export const setCoord = (geocode, actionTypeBrute) => {
  return function (dispatch) {
    const actionType =
      actionTypeBrute === "LOCALISATION" ? SET_LOCALISATION : SET_ADDRESS;

    dispatch({ type: actionType, payload: geocode });
  };
};

export const handleChangeSettings = (name, type, inputValue) => {
  const actionType = type === "isPress" ? SET_IS_PRESS : SET_SETTING;

  return function (dispatch) {
    dispatch({ type: actionType, payload: { name, type, inputValue } });
  };
};
