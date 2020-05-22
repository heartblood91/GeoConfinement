import {
  SET_SETTING,
  SET_IS_PRESS,
  SET_ADDRESS,
  SYNCHRO_SETTING_INIT,
} from "../actions/action-types";
import { DEFAULT_ADDRESS } from "../staticVariables/default-coord";

//Initiale Store of isPress
const initialStateIsPress = {
  geolocation: false,
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
  geolocation: {
    value: false,
    text: "Géolocalisation",
  },
  nightMode: {
    value: false,
    text: "Mode sombre",
  },
  notification: {
    value: false,
    text: "Notification",
  },
  address: {
    ...DEFAULT_ADDRESS,
    text: "Adresse:",
  },
  radius: {
    value: 100000,
    text: "Rayon:",
  },
};

export default function (state = initializeState, action) {
  let newPayload = "";

  switch (action.type) {
    case SET_SETTING:
      newPayload;
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
      newPayload =
        action.payload === ""
          ? Object.assign({}, initializeState.address)
          : Object.assign({}, action.payload);
      return {
        ...state,
        address: newPayload,
      };

    // Synchronise les settings avec les informations récupérer dans le storage
    case SYNCHRO_SETTING_INIT:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}
