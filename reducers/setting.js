import { SET_LOCATION, SYNCHRO_SETTING } from "../actions/action-types";

// initialise le store
const initializeState = {
  searchlocation: {
    value: "Default",
    coord: {
      lat: 47.384714655010384,
      lon: 2.449696697294711,
    },
  },
  geolocation: false,
  notification: false,
  visualWarning: false,
  timer: false,
  nightMode: false,
  address: {
    value: "",
    coord: {
      lat: 0,
      lon: 0,
    },
  },
  radius: 100000,
};

export default function (state = initializeState, action) {
  switch (action.type) {
    case SET_LOCATION:
      return {
        ...state,
        searchlocation: action.payload,
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
