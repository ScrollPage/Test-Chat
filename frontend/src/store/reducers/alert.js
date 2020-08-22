import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  text: null,
  alertType: 'secondary'
};

const openAlert = (state, action) => {
  return updateObject(state, { text: action.text, alertType: action.alertType });
};

const closeAlert = (state, action) => {
  return updateObject(state, { text: null });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.OPEN_ALERT:
      return openAlert(state, action);
    case actionTypes.CLOSE_ALERT:
      return closeAlert(state, action);
    default:
      return state;
  }
};

export default reducer;