import { SET_PARAMS } from "./action-types";

export const setCoordLocalization = (searchLocalization) => {
  return function (dispatch) {
    dispatch({ type: SET_PARAMS, payload: searchLocalization });
  };
};
