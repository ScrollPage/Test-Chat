import * as types from '../types';

const initialState = {
  search: ''
};

const handlers = {
  [types.SET_SEARCH]: (state, { search }) => ({ ...state, search }),
  DEFAULT: state => state
};

export const searchReducer = (state = initialState, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT;
  return handler(state, action);
};
