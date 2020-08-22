import axios from 'axios';
import * as actionTypes from './actionTypes';
import { openAlert } from './alert';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
}

export const authSuccess = (username, token) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    username: username
  }
}

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  }
}

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('expirationDate');
  return {
    type: actionTypes.AUTH_LOGOUT
  };
}

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000)
  }
}

export const authLogin = (username, password) => {
  return dispatch => {
    dispatch(authStart());
    axios.post('http://127.0.0.1:8000/auth/jwt/create', {
      username: username,
      password: password
    })
      .then(res => {
        const token = res.data.access;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(authSuccess(username, token));
        dispatch(checkAuthTimeout(3600));
        dispatch(openAlert('Вы успешно вошли!', 'success'));
      })
      .catch(err => {
        dispatch(authFail(err));
        dispatch(openAlert('Неверный логин или пароль!', 'warning'));
      })
  }
}

export const authSignup = (username, email, password) => {
  return dispatch => {
    axios.post('http://127.0.0.1:8000/api/v1/register/ ', {
      username: username,
      email: email,
      password: password
    })
      .then(res => {
        dispatch(openAlert('На ваш E-mail пришло подтверждение!', 'success'));
      })
      .catch(err => {
        dispatch(openAlert('Что-то пошло не так!', 'warning'));
      })
  }
}

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(username, token));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  }
}

export const authActivate = (token) => {
  return dispatch => {
    axios.post('http://127.0.0.1:8000/api/v1/activate/ ', {
      token: token
    })
      .then(res => {
        console.log(res);
        console.log('Актвация прошла успешно');
      })
      .catch(err => {
        console.leg('Ошибка активации');
      })
  }
}

