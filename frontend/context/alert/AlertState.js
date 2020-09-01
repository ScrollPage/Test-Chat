import {
  ALERT_SHOW,
  ALERT_HIDE
} from '../types';
import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { AlertContext } from './AlertContext';
import { AlertReducer } from './AlertReducer';

export const AlertState = ({ children }) => {

  const [state, dispatch] = useReducer(AlertReducer, null);

  const hide = () => dispatch({ type: ALERT_HIDE });

  const show = (text, type = 'success') =>
    dispatch({
      type: ALERT_SHOW,
      payload: { type, text }
    });

  return (
    <AlertContext.Provider value={{
      hide, show, alert: state
    }}>
      {children}
    </AlertContext.Provider>
  );
}

AlertState.propTypes = {
  children: PropTypes.element
}

