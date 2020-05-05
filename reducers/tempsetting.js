import {
  SET_SETTING,
  SET_IS_PRESS,
  SET_ADDRESS,
} from "../actions/action-types";

//Initiale Store of isPress
const initialStateIsPress = {
  geolocalisation: false,
  notification: false,
  visualWarning: false,
  timer: false,
  nightMode: false,
};

// initialise le store
const initializeState = {
  isPress: {
    ...initialStateIsPress,
  },

  timer: {
    value: false,
    text: "Compte à rebours",
  },
  visualWarning: {
    value: false,
    text: "Couleur zone dynamique",
  },
  geolocalisation: {
    value: false,
    text: "Géolocalisation",
  },
  nightMode: {
    value: false,
    text: "Mode nuit",
  },
  notification: {
    value: false,
    text: "Notification",
  },
  address: {
    value: "",
    coord: {
      lat: 0,
      lon: 0,
    },
    text: "Adresse:",
  },
  radius: {
    value: 1000,
    text: "Rayon (en m):",
  },
};

export default function (state = initializeState, action) {
  switch (action.type) {
    case SET_SETTING:
      let newPayload;
      if (action.payload.type === "value") {
        newPayload = {
          ...state[action.payload.name],
          value: !state[action.payload.name][action.payload.type],
        };
      } else if (action.payload.type === "input") {
        newPayload = {
          ...state[action.payload.name],
          value: parseInt(action.payload.inputValue, 10),
        };
      }

      return {
        ...state,
        [action.payload.name]: newPayload,
      };

    case SET_IS_PRESS:
      return {
        ...state,
        isPress: {
          ...initialStateIsPress,
          [action.payload.name]: !state.isPress[action.payload.name],
        },
      };

    case SET_ADDRESS:
      return {
        ...state,
        address: action.payload,
      };

    default:
      return state;
  }
}
