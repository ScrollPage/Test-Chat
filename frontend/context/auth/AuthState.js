import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT
} from '../types';

import React, { useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';
import { AuthReducer } from './AuthReducer';
import { AlertContext } from '../alert/AlertContext'
import axios from 'axios';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';
import WebSocketInstance from '@/websocket';

export const AuthState = ({ children }) => {

  const { push, query } = useRouter();

  const { show } = useContext(AlertContext);

  const initialState = {
    token: null,
    username: null,
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const authLogin = (username, password) => {
    authStart();
    axios.post('/auth/jwt/create', {
      username: username,
      password: password
    })
      .then(res => {
        const token = res.data.access;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);

        Cookie.set('token', token);
        Cookie.set('username', username);
        Cookie.set('expirationDate', expirationDate);

        authSuccess(username, token);
        checkAuthTimeout(3600);

        show('Вы успешно вошли!', 'success');
      })
      .catch(err => {
        authFail(err);
        show('Неверный логин или пароль!', 'warning');
      })
  };

  const authSignup = (username, email, password) => {
    axios.post('/api/v1/register/ ', {
      username: username,
      email: email,
      password: password
    })
      .then(res => {
        show('На ваш E-mail пришло подтверждение!', 'success');
      })
      .catch(err => {
        show('Что-то пошло не так!', 'warning');
      })
  };

  const authCheckState = () => {
    const token = Cookie.get('token');
    const username = Cookie.get('username');
    if (token === undefined) {
      logout();
    } else {
      const expirationDate = new Date(Cookie.get('expirationDate'));
      if (expirationDate <= new Date()) {
        logout();
      } else {
        authSuccess(username, token);
        checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000);
      }
    }
  };

  const authActivate = (token) => {
    axios.post('/api/v1/activate/ ', {
      token: token
    })
      .then(res => {
        console.log(res);
        show('Активация прошла успешно!', 'success');
      })
      .catch(err => {
        show('Ошибка активации!', 'success');
      })
  };

  const authStart = () => dispatch({ type: AUTH_START });

  const authSuccess = (username, token) => dispatch({ type: AUTH_SUCCESS, username, token });

  const authFail = (error) => dispatch({ type: AUTH_FAIL, error });

  const checkAuthTimeout = (expirationTime) => setTimeout(() => { logout() }, expirationTime * 1000);

  const logout = () => {
    push({ pathname: '/' }, undefined, { shallow: true });
    if (query.chatID !== undefined) {
      WebSocketInstance.disconnect();
    }
    Cookie.remove('token');
    Cookie.remove('username');
    Cookie.remove('expirationDate');
    dispatch({ type: AUTH_LOGOUT});
    show('Вы успешно вышли!', 'success');
  };

  const { token, username, loading, error } = state;

  return (
    <AuthContext.Provider value={{
      authLogin,
      authSignup,
      authCheckState,
      authActivate,
      logout,
      checkAuthTimeout,
      token, username, loading, error
    }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthState.propTypes = {
  children: PropTypes.element
}

