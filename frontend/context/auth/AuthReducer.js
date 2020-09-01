import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT
} from '../types';

const handlers = {
  [AUTH_START]: (state) => ({ ...state, error: null, loading: true }),
  [AUTH_SUCCESS]: (state, { username, token }) => ({ ...state, token: token, username: username, loading: false }),
  [AUTH_FAIL]: (state, { error }) => ({ ...state, error: error, loading: false }),
  [AUTH_LOGOUT]: (state) => ({ ...state, token: null, username: null}),
  DEFAULT: state => state
};

export const AuthReducer = (state, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT
  return handler(state, action)
};