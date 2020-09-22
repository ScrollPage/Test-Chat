import * as types from '../types';

export const setMessages = messages => dispatch => {
  dispatch(setLoading());
  dispatch(setMessagesSuccess(messages));
  dispatch(setLoadingFalse());
};

export const setMessagesSuccess = messages => ({
  type: types.SET_MESSAGES,
  messages
});

export const setLoadingFalse = () => ({ type: types.SET_LOADING_FALSE });

export const setLoading = () => ({ type: types.SET_LOADING });

export const addMessage = message => ({ type: types.ADD_MESSAGE, message });
