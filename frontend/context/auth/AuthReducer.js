import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT
} from '../types';

const handlers = {
  [AUTH_START]: (state) => ({ ...state, error: null, loading: true }),
  [AUTH_SUCCESS]: (state, { token, firstName, lastName, phoneNumber, slug, userId, email }) => ({ ...state, token: token, firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, slug: slug, userId: userId, email: email, loading: false }),
  [AUTH_FAIL]: (state, { error }) => ({ ...state, error: error, loading: false }),
  [AUTH_LOGOUT]: (state) => ({ ...state, token: null, firstName: null, lastName: null, phoneNumber: null, slug: null, userId: null, email: null}),
  DEFAULT: state => state
};

export const AuthReducer = (state, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT
  return handler(state, action)
};