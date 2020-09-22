import axios from 'axios';
import Cookie from 'js-cookie';
import Router from 'next/router';
import { show } from './alert';

export const addFriend = friendId => async dispatch => {
  await axios
    .post('/api/v1/request/add/', {
      sender: Cookie.get('userId'),
      receiver: friendId
    })
    .then(res => {
      dispatch(
        show('Вы успешно отправили запрос о добавлении в друзья!', 'success')
      );
    })
    .catch(err => {
      dispatch(
        show('Ошибка отправки запроса о добавлении в друзья!', 'warning')
      );
    });
};

export const removeAddFriend = friendId => async dispatch => {
  await axios
    .post('/api/v1/request/remove/', {
      sender: Cookie.get('userId'),
      receiver: friendId
    })
    .then(res => {
      dispatch(
        show('Вы успешно отменили запрос о добавлении в друзья!', 'success')
      );
    })
    .catch(err => {
      dispatch(show('Ошибка отмены запроса о добавлении в друзья!', 'warning'));
    });
};

export const removeFriend = friendId => async dispatch => {
  await axios
    .post('/api/v1/friends/remove/', {
      sender: Cookie.get('userId'),
      receiver: friendId
    })
    .then(res => {
      dispatch(show('Вы успешно удалили из друзей!', 'success'));
    })
    .catch(err => {
      dispatch(show('Ошибка удаления друга!', 'warning'));
    });
};

export const createChat = friendId => async dispatch => {
  await axios
    .post('/api/v1/chat/', {
      participants: [Cookie.get('userId'), String(friendId)]
    })
    .then(res => {
      Router.push('/dialogs/[chatID]', `/dialogs/${res.data.id}`, {
        shallow: true
      });
      dispatch(show('Вы успешно создали чат!', 'success'));
    })
    .catch(err => {
      dispatch(show('Ошибка создания чата!', 'warning'));
    });
};