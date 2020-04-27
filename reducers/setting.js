import {
  SET_SETTING,
  SET_LOCALISATION,
  SET_ADDRESS,
} from "../actions/action-types";

// initialise le store
const initializeState = {
  searchLocalization: {
    name: "Default",
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
    name: "",
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

    case SET_ADDRESS:
      return {
        ...state,
        address: action.payload,
        searchLocalization: action.payload,
      };

    case SET_SETTING:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}
