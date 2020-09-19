import {
} from '../types';

const handlers = {
  DEFAULT: state => state
};

export const FriendReducer = (state, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT
  return handler(state, action)
};