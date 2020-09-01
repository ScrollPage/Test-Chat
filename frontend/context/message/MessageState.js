import {
  ADD_MESSAGE,
  SET_MESSAGES,
  SET_LOADING_FALSE,
  SET_LOADING
} from '../types';

import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { MessageContext } from './MessageContext';
import { MessageReducer } from './MessageReducer';

export const MessageState = ({ children }) => {
  
  const initialState = {
    messages: [],
    loading: false
  };

  const [state, dispatch] = useReducer(MessageReducer, initialState);

  const setMessages = (messages) => {
    setLoading();
    setMessagesSuccess(messages);
    setLoadingFalse();
  }

  const setMessagesSuccess = (messages) => dispatch({ type: SET_MESSAGES, messages });

  const setLoadingFalse = () => dispatch({ type: SET_LOADING_FALSE });

  const setLoading = () => dispatch({ type: SET_LOADING });

  const addMessage = (message) => dispatch({ type: ADD_MESSAGE, message });

  const { messages, loading } = state;

  return (
    <MessageContext.Provider value={{
      addMessage, 
      setMessages,
      setLoading,
      setLoadingFalse,
      messages, loading
    }}>
      {children}
    </MessageContext.Provider>
  );
}

MessageState.propTypes = {
  children: PropTypes.element
}

