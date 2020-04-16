import { combineReducers } from "redux";

const rootReducer = combineReducers({
  todo: () => {
    return { data: "azerty" };
  },
});

export default rootReducer;
