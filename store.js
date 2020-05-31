import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducers from "./reducers";
const invariant = require("redux-immutable-state-invariant").default();

// Enlève la vérification des mutations de state dans le cadre d'une application en développement
const composedEnhancer =
  process.env.NODE_ENV === "development"
    ? composeWithDevTools(applyMiddleware(thunk, invariant))
    : applyMiddleware(thunk);

const store = createStore(reducers, {}, composedEnhancer);

export default store;
