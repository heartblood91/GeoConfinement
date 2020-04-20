import { SET_SETTING, SET_LOCALISATION } from "./action-types";

export const setCoordLocalization = (searchLocalization) => {
  return function (dispatch) {
    dispatch({ type: SET_LOCALISATION, payload: searchLocalization });
  };
};

export const handleChangeSettings = (value, name) => {
  return function (dispatch) {
    dispatch({ type: SET_SETTING, payload: { [name]: value } });
  };
};
