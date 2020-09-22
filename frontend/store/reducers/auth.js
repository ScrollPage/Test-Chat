import * as types from '../types';

const initialState = {
  token: null,
  firstName: null,
  lastName: null,
  phoneNumber: null,
  slug: null,
  userId: null,
  email: null,
  loading: false,
  error: null
};

const handlers = {
  [types.AUTH_START]: state => ({ ...state, error: null, loading: true }),
  [types.AUTH_SUCCESS]: (
    state,
    { token, firstName, lastName, phoneNumber, slug, userId, email }
  ) => ({
    ...state,
    token,
    firstName,
    lastName,
    phoneNumber,
    slug,
    userId,
    email,
    loading: false
  }),
  [types.AUTH_FAIL]: (state, { error }) => ({
    ...state,
    error,
    loading: false
  }),
  [types.AUTH_LOGOUT]: state => ({
    ...state,
    token: null,
    firstName: null,
    lastName: null,
    phoneNumber: null,
    slug: null,
    userId: null,
    email: null
  }),
  DEFAULT: state => state
};

export const authReducer = (state = initialState, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT;
  return handler(state, action);
};
