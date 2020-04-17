import SET_PARAMS from "../actions/action-types";

// initialise le store
const initializeState = {
  data: "azerty",
};

export default function (state = initializeState, action) {
  switch (action.type) {
    case SET_PARAMS:
      return {
        data: action.payload,
      };

    default:
      return state;
  }
}
