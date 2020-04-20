import { SET_SETTING, SET_LOCALISATION } from "../actions/action-types";

// initialise le store
const initializeState = {
  searchLocalization: {
    name: "Default",
    coord: {
      lat: 48.859268,
      lon: 2.34706,
    },
  },
  geolocalisation: false,
  notification: false,
  visualWarning: false,
  timer: false,
  nightMode: false,
  address: "",
};

export default function (state = initializeState, action) {
  switch (action.type) {
    case SET_LOCALISATION:
      return {
        ...state,
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
