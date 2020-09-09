import {
  SET_SEARCH
} from '../types';

const handlers = {
  [SET_SEARCH]: (state, { search }) => ({ ...state, search: search }),
  DEFAULT: state => state
};

export const SearchReducer = (state, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT
  return handler(state, action)
};