import {
} from '../types';

import React, { useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { FriendContext } from './FriendContext';
import { FriendReducer } from './FriendReducer';
import { AlertContext } from '../alert/AlertContext'
import axios from 'axios';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';

export const FriendState = ({ children }) => {

  const { push } = useRouter();

  const { show } = useContext(AlertContext);

  const initialState = {
    
  };

  const [state, dispatch] = useReducer(FriendReducer, initialState);

  const addFriend = (friendId) => {
    axios.post('/api/v1/request/add/', {
      sender: Cookie.get('userId'),
      receiver: friendId 
    })
      .then(res => {
        console.log(res);
        show('Вы успешно отправили запрос о добавлении в друзья!', 'success');
      })
      .catch(err => {
        show('Ошибка отправки запроса!', 'warning');
      })
  };

  const removeAddFriend = (friendId) => {
    axios.post('/api/v1/request/remove/', {
      sender: Cookie.get('userId'),
      receiver: friendId 
    })
      .then(res => {
        console.log(res);
        show('Вы успешно отменили запрос о добавлении в друзья!', 'success');
      })
      .catch(err => {
        show('Ошибка отправки запроса!', 'warning');
      })
  };

  const removeFriend = (friendId) => {
    axios.post('/api/v1/friends/remove/', {
      sender: Cookie.get('userId'),
      receiver: friendId 
    })
      .then(res => {
        console.log(res);
        show('Вы успешно удалили из друзей!', 'success');
      })
      .catch(err => {
        show('Ошибка отправки запроса!', 'warning');
      })
  };
  
  const createChat = (friendId) => {
    axios.post('/api/v1/chat/', {
      participants: [ Cookie.get('userId'), String(friendId)]
    })
      .then(res => {
        push('/dialogs/[chatID]', `/dialogs/${res.data.id}`, { shallow: true });
        show('Вы успешно создали чат!', 'success');
      })
      .catch(err => {
        show('Ошибка отправки запроса!', 'warning');
      })
  };

  // const { token, firstName, lastName, phoneNumber, slug, userId, email, loading, error } = state;

  return (
    <FriendContext.Provider value={{
      addFriend,
      removeAddFriend,
      removeFriend, 
      createChat
    }}>
      {children}
    </FriendContext.Provider>
  );
}

FriendState.propTypes = {
  children: PropTypes.element
}

