import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducers from "./reducers";
const invariant = require("redux-immutable-state-invariant").default();

const composedEnhancer =
  process.env.NODE_ENV === "development"
    ? composeWithDevTools(applyMiddleware(thunk, invariant))
    : composeWithDevTools(applyMiddleware(thunk));

const store = createStore(reducers, {}, composedEnhancer);

export default store;
