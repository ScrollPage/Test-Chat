import * as actionTypes from "./actionTypes";

export const openAlert = (text, alertType = 'secondary') => {
  return {
    type: actionTypes.OPEN_ALERT,
    text: text,
    alertType: alertType
  };
};

export const closeAlert = () => {
  return {
    type: actionTypes.CLOSE_ALERT
  };
};