import { SET_PARAMS } from "../actions/action-types";

// initialise le store
const initializeState = {
  searchLocalization: {
    name: "Paris",
    coord: {
      lat: 48.859268,
      lon: 2.34706,
    },
  },
};

export default function (state = initializeState, action) {
  switch (action.type) {
    case SET_PARAMS:
      return {
        ...state,
        searchLocalization: action.payload,
      };

    default:
      return state;
  }
}
