import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  messages: [],
  chats: [],
  loading: true, 
  error: null
};

const setLoadingMessages = (state, action) => {
  return updateObject(state, {
    loading: true
  });
};

const fetchErrorMessages = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error
  });
};

const addMessage = (state, action) => {
  return updateObject(state, {
    messages: [...state.messages, action.message]
  });
};

const setMessages = (state, action) => {
  return updateObject(state, {
    messages: action.messages.reverse()
  });
};

const setChats = (state, action) => {
  return updateObject(state, {
    chats: action.chats,
    loading: false
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) { 
    case actionTypes.ADD_MESSAGE:
      return addMessage(state, action);
    case actionTypes.SET_MESSAGES:
      return setMessages(state, action);
    case actionTypes.GET_CHATS_SUCCESS:
      return setChats(state, action); 
    case actionTypes.FETCH_ERROR_MESSAGES:
      return fetchErrorMessages(state, action); 
    case actionTypes.SET_LOADING_MESSAGES:
      return setLoadingMessages(state, action); 
    default:
      return state; 
  }
};

export default reducer