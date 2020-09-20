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
    firstName: null,
    lastName: null,
    phoneNumber: null,
    slug: null,
    userId: null,
    email: null,
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const authInfo = (token) => {
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios.get('/auth/users/me/')
      .then(res => {
        const firstName = res.data.first_name;
        const lastName = res.data.last_name;
        const phoneNumber = res.data.phone_number;
        const slug = res.data.slug;
        const userId = res.data.id;
        const email = res.data.email;
        Cookie.set('email', email);
        Cookie.set('firstName', firstName);
        Cookie.set('lastName', lastName);
        Cookie.set('phoneNumber', phoneNumber);
        Cookie.set('slug', slug);
        Cookie.set('userId', userId);
        console.log('Информация успешно занесена в куки');

        authSuccess(token, firstName, lastName, phoneNumber, slug, userId, email);
      })
      .catch(err => {
        console.log('Ошибка при взятии информации о пользователе')
      })
  }

  const authLogin = (email, password) => {
    authStart();
    axios.post('/auth/jwt/create/', {
      email: email,
      password: password
    })
      .then(res => {
        const token = res.data.access;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);

        Cookie.set('token', token);
        Cookie.set('expirationDate', expirationDate);
        authInfo(token);
        checkAuthTimeout(3600);

        show('Вы успешно вошли!', 'success');
        push({ pathname: '/dialogs' }, undefined, { shallow: true });
      })
      .catch(err => {
        authFail(err);
        show('Неверный логин или пароль!', 'warning');
      })
  };

  const authSignup = (email, firstName, lastName, phoneNumber, password) => {
    axios.post('/api/v1/register/ ', {
      email: email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
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
    const firstName = Cookie.get('firstName');
    const lastName = Cookie.get('lastName');
    const phoneNumber = Cookie.get('phoneNumber');
    const slug = Cookie.get('slug');
    const userId = Cookie.get('userId');
    const email = Cookie.get('email');
    if (token === undefined) {
      logout();
    } else {
      const expirationDate = new Date(Cookie.get('expirationDate'));
      if (expirationDate <= new Date()) {
        logout();
      } else {
        authSuccess(token, firstName, lastName, phoneNumber, slug, userId, email);
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
        show('Ошибка активации!', 'warning');
      })
  };

  const authStart = () => dispatch({ type: AUTH_START });

  const authSuccess = (token, firstName, lastName, phoneNumber, slug, userId, email) => dispatch({ type: AUTH_SUCCESS, token, firstName, lastName, phoneNumber, slug, userId, email });

  const authFail = (error) => dispatch({ type: AUTH_FAIL, error });

  const checkAuthTimeout = (expirationTime) => setTimeout(() => { logout() }, expirationTime * 1000);

  const logout = () => {
    push({ pathname: '/' }, undefined, { shallow: true });
    if (query.chatID !== undefined) {
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
    dispatch({ type: AUTH_LOGOUT });
    show('Вы успешно вышли!', 'success');
  };

  const authChange = (email, firstName, lastName, phoneNumber) => {

    axios.patch(`/api/v1/contact/${Cookie.get('userId')}/`, {
      email: email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber
    })
      .then(res => {
        console.log(res);
        Cookie.set('email', email);
        Cookie.set('firstName', firstName);
        Cookie.set('lastName', lastName);
        Cookie.set('phoneNumber', phoneNumber);
        show('Вы успешно сменили данные!', 'success');
        push({ pathname: '/dialogs' }, undefined, { shallow: true });
      })
      .catch(err => {
        show('Ошибка смены данных!', 'warning');
      })
  }

  const { token, firstName, lastName, phoneNumber, slug, userId, email, loading, error } = state;

  return (
    <AuthContext.Provider value={{
      authLogin,
      authSignup,
      authCheckState,
      authActivate,
      logout,
      checkAuthTimeout,
      authChange,
      token, firstName, lastName, phoneNumber, slug, userId, email, loading, error
    }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthState.propTypes = {
  children: PropTypes.element
}

