import {
  ADD_MESSAGE,
  SET_MESSAGES,
  SET_LOADING_FALSE,
  SET_LOADING
} from '../types';

const handlers = {
  [ADD_MESSAGE]: (state, { message }) => ({ ...state, messages: [...state.messages, message] }),
  [SET_MESSAGES]: (state, { messages }) => ({ ...state, messages: messages.reverse() }),
  [SET_LOADING_FALSE]: (state) => ({ ...state, loading: false }),
  [SET_LOADING]: (state) => ({ ...state, loading: true }),
  DEFAULT: state => state
};

export const MessageReducer = (state, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT
  return handler(state, action)
};