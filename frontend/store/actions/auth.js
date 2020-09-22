import axios from 'axios';
import Cookie from 'js-cookie';
import Router from 'next/router';
import * as types from '../types';
import WebSocketInstance from '@/websocket';
import { show } from './alert';

export const authInfo = token => async dispatch => {
  axios.defaults.headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`
  };
  await axios
    .get('/auth/users/me/')
    .then(res => {
      Cookie.set('email', res.data.email);
      Cookie.set('firstName', res.data.first_name);
      Cookie.set('lastName', res.data.last_name);
      Cookie.set('phoneNumber', res.data.phone_number);
      Cookie.set('slug', res.data.slug);
      Cookie.set('userId', res.data.id);
      console.log('Информация успешно занесена в куки');
      dispatch(
        authSuccess(
          token,
          res.data.first_name,
          res.data.last_name,
          res.data.phone_number,
          res.data.slug,
          res.data.id,
          res.data.email
        )
      );
      Router.push({ pathname: '/dialogs' }, undefined, { shallow: true });
    })
    .catch(err => {
      dispatch(show('Ошибка при взятии информации о пользователе!', 'warning'));
    });
};

export const authLogin = (email, password) => async dispatch => {
  dispatch(authStart());
  await axios
    .post('/auth/jwt/create/', {
      email,
      password
    })
    .then(res => {
      const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
      Cookie.set('token', res.data.access);
      Cookie.set('expirationDate', expirationDate);
      dispatch(authInfo(res.data.access));
      dispatch(checkAuthTimeout(3600));
      dispatch(show('Вы успешно вошли!', 'success'));
    })
    .catch(err => {
      dispatch(authFail(err));
      dispatch(show('Неверный логин или пароль!', 'warning'));
    });
};

export const authSignup = (
  email,
  firstName,
  lastName,
  phoneNumber,
  password
) => async dispatch => {
  console.log('раз');
  await axios
    .post('/api/v1/register/ ', {
      email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      password
    })
    .then(res => {
      dispatch(show('На ваш E-mail пришло подтверждение!', 'success'));
    })
    .catch(err => {
      dispatch(show('Что-то пошло не так!', 'warning'));
    });
};

export const authCheckState = () => dispatch => {
  const token = Cookie.get('token');
  const firstName = Cookie.get('firstName');
  const lastName = Cookie.get('lastName');
  const phoneNumber = Cookie.get('phoneNumber');
  const slug = Cookie.get('slug');
  const userId = Cookie.get('userId');
  const email = Cookie.get('email');
  if (token === undefined) {
    dispatch(logout());
  } else {
    const expirationDate = new Date(Cookie.get('expirationDate'));
    if (expirationDate <= new Date()) {
      dispatch(logout());
    } else {
      dispatch(
        authSuccess(
          token,
          firstName,
          lastName,
          phoneNumber,
          slug,
          userId,
          email
        )
      );
      dispatch(
        checkAuthTimeout(
          (expirationDate.getTime() - new Date().getTime()) / 1000
        )
      );
    }
  }
};

export const authActivate = token => async dispatch => {
  await axios
    .post('/api/v1/activate/ ', {
      token
    })
    .then(res => {
      dispatch(show('Активация прошла успешно!', 'success'));
    })
    .catch(err => {
      dispatch(show('Ошибка активации!', 'warning'));
    });
};

export const authStart = () => ({ type: types.AUTH_START });

export const authSuccess = (
  token,
  firstName,
  lastName,
  phoneNumber,
  slug,
  userId,
  email
) => ({
  type: types.AUTH_SUCCESS,
  token,
  firstName,
  lastName,
  phoneNumber,
  slug,
  userId,
  email
});

export const authFail = error => ({ type: types.AUTH_FAIL, error });

export const checkAuthTimeout = expirationTime => dispatch =>
  setTimeout(() => dispatch(logout()), expirationTime * 1000);

export const logout = () => dispatch => {
  if (Router.query.chatID !== undefined) {
    WebSocketInstance.disconnect();
  }
  Cookie.remove('token');
  Cookie.remove('expirationDate');
  Cookie.remove('firstName');
  Cookie.remove('lastName');
  Cookie.remove('phoneNumber');
  Cookie.remove('slug');
  Cookie.remove('userId');
  Cookie.remove('email');
  Router.push({ pathname: '/' }, undefined, { shallow: true });
  dispatch(show('Вы успешно вышли!', 'success'));
  return { type: types.AUTH_LOGOUT };
};

export const authChange = (
  email,
  firstName,
  lastName,
  phoneNumber
) => async dispatch => {
  await axios
    .patch(`/api/v1/contact/${Cookie.get('userId')}/`, {
      email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber
    })
    .then(res => {
      Cookie.set('email', email);
      Cookie.set('firstName', firstName);
      Cookie.set('lastName', lastName);
      Cookie.set('phoneNumber', phoneNumber);
      Router.push({ pathname: '/dialogs' }, undefined, { shallow: true });
      dispatch(show('Вы успешно сменили данные!', 'success'));
    })
    .catch(err => {
      dispatch(show('Ошибка смены данных!', 'warning'));
    });
};
