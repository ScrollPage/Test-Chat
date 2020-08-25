import axios from "axios";
import * as actionTypes from "./actionTypes";

export const addMessage = message => {
  return {
    type: actionTypes.ADD_MESSAGE,
    message: message
  };
};

export const setMessages = messages => {
  return {
    type: actionTypes.SET_MESSAGES,
    messages: messages
  };
};

const getUserChatsSuccess = chats => {
  return {
    type: actionTypes.GET_CHATS_SUCCESS,
    chats: chats
  };
};

const setLoadingMessages = () => {
  return {
    type: actionTypes.SET_LOADING_MESSAGES
  };
};

const fetchErrorMessages = (error) => {
  return {
    type: actionTypes.FETCH_ERROR_MESSAGES,
    error: error
  };
};

export const getUserChats = (username, token) => {
  return dispatch => {
    setLoadingMessages();
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .get(`http://127.0.0.1:8000/api/v1/chat/?username=${username}`)
      .then(res => {
        dispatch(getUserChatsSuccess(res.data));
      })
      .catch(error => {
        dispatch(fetchErrorMessages(error));
      });
  };
};