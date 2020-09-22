import * as types from '../types';

const initialState = {
  messages: [],
  loading: false
};

const handlers = {
  [types.ADD_MESSAGE]: (state, { message }) => ({
    ...state,
    messages: [...state.messages, message]
  }),
  [types.SET_MESSAGES]: (state, { messages }) => ({
    ...state,
    messages: messages.reverse()
  }),
  [types.SET_LOADING_FALSE]: state => ({ ...state, loading: false }),
  [types.SET_LOADING]: state => ({ ...state, loading: true }),
  DEFAULT: state => state
};

export const messageReducer = (state = initialState, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT;
  return handler(state, action);
};
