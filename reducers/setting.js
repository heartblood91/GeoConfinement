import {
  SET_LOCALISATION,
  SYNCHRO_SETTING_TEMP,
} from "../actions/action-types";

// initialise le store
const initializeState = {
  searchLocalization: {
    value: "Default",
    coord: {
      lat: 47.384714655010384,
      lon: 2.449696697294711,
    },
  },
  geolocalisation: false,
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
  radius: 1000,
};

export default function (state = initializeState, action) {
  switch (action.type) {
    case SET_LOCALISATION:
      return {
        ...state,
        searchLocalization: action.payload,
      };

    case SYNCHRO_SETTING_TEMP:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}
