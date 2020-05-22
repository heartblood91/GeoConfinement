import { SET_LOCATION, SYNCHRO_SETTING } from "../actions/action-types";
import { DEFAULT_ADDRESS } from "../staticVariables/default-coord";

// initialise le store
const initializeState = {
  searchlocation: {
    ...DEFAULT_ADDRESS,
  },
  geolocation: false,
  notification: false,
  visualWarning: false,
  timer: false,
  nightMode: false,
  address: {
    ...DEFAULT_ADDRESS,
  },
  radius: 100000,
};

export default function (state = initializeState, action) {
  switch (action.type) {
    case SET_LOCATION:
      const newPayload =
        action.payload === ""
          ? Object.assign({}, initializeState.searchlocation)
          : Object.assign({}, action.payload);
      return {
        ...state,
        searchlocation: newPayload,
      };

    case SYNCHRO_SETTING:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}
