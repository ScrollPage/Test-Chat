import axios from 'axios';
import Cookie from 'js-cookie';
import Router from 'next/router';
import { show } from './alert';

export const addPost = (text, imageUrl) => async dispatch => {
  await axios
    .post('/api/v1/post/', {
      slug: Cookie.get('slug'),
      text,
      image: imageUrl
    })
    .then(res => {
      dispatch(show('Пост успешно добавлен!', 'success'));
    })
    .catch(err => {
      dispatch(show('Ошибка в добавлении поста!', 'warning'));
    });
};

export const addLike = postId => async dispatch => {
  await axios
    .post('/api/v1/like/add/', {
      user: Number(Cookie.get('userId')),
      post_id: postId
    })
    .then(res => {
      dispatch(show('Лайк успешно добавлен!', 'success'));
    })
    .catch(err => {
      dispatch(show('Ошибка в добавлении лайка!', 'warning'));
    });
};

export const removeLike = postId => async dispatch => {
  await axios
    .post('/api/v1/like/remove/', {
      user: Cookie.get('userId'),
      post_id: postId
    })
    .then(res => {
      dispatch(show('Лайк успешно убран!', 'success'));
    })
    .catch(err => {
      dispatch(show('Ошибка в убирании лайка!', 'warning'));
    });
};
