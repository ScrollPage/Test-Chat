import { trigger } from 'swr';
import axios from 'axios';
import Cookie from 'js-cookie';
import Router from 'next/router';
import WebSocketInstance from '@/websocket';
import { show } from './alert';
import { ThunkType } from '@/types/thunk';

export const authInfo = (token: string): ThunkType => async dispatch => {
    axios.defaults.headers = {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
    }
    await axios
        .get('/api/v1/me/')
        .then(res => {
            Cookie.set('userId', res.data.id);
            Cookie.set('email', res.data.email);
            Cookie.set('firstName', res.data.first_name);
            Cookie.set('lastName', res.data.last_name);
            Cookie.set('slug', res.data.slug);
            Cookie.set('avatar', res.data.avatar);
            Cookie.set('smallAvatar', res.data.small_avatar);
            Cookie.set('phoneNumber', res.data.phone_number);
            console.log('Информация успешно занесена в куки');
            Router.push({ pathname: '/dialogs' }, undefined, { shallow: true });
        })
        .catch(err => {
            dispatch(show('Ошибка при взятии информации о пользователе!', 'warning'));
        });
};

export const authLogin = (email: string, password: string): ThunkType => async dispatch => {
    await axios
        .post('/auth/jwt/create/', {
            email,
            password,
        })
        .then(res => {
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000 * 24);
            Cookie.set('token', res.data.access);
            Cookie.set('expirationDate', expirationDate);
            dispatch(authInfo(res.data.access));
            dispatch(checkAuthTimeout(3600 * 24));
            dispatch(show('Вы успешно вошли!', 'success'));
        })
        .catch(err => {
            dispatch(show('Неверный логин или пароль!', 'warning'));
        });
};

export const authSignup = (
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    password: string
): ThunkType => async dispatch => {
    await axios
        .post('/api/v1/register/ ', {
            email,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            password,
        })
        .then(res => {
            dispatch(show('На ваш E-mail пришло подтверждение!', 'success'));
        })
        .catch(err => {
            dispatch(show('Что-то пошло не так!', 'warning'));
        });
};

export const authCheckState = (): ThunkType => dispatch => {
    const token = Cookie.get('token');
    if (token === undefined) {
        dispatch(logout());
    } else {
        const date: any = Cookie.get('expirationDate');
        const expirationDate = new Date(date);
        if (expirationDate <= new Date()) {
            dispatch(logout());
        } else {
            dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
        }
    }
};

export const authActivate = (token: string): ThunkType => async dispatch => {
    await axios
        .post('/api/v1/activation/email/ ', {
            token,
        })
        .then(res => {
            dispatch(show('Активация прошла успешно!', 'success'));
        })
        .catch(err => {
            dispatch(show('Ошибка активации!', 'warning'));
        });
};

export const checkAuthTimeout = (expirationTime: number): ThunkType => dispatch =>
    setTimeout(() => dispatch(logout()), expirationTime * 1000);

export const logout = () => (dispatch: any) => {
    Router.push({ pathname: '/' }, undefined, { shallow: true });
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
    dispatch(show('Вы успешно вышли!', 'success'));
};

export const authChange = (
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
): ThunkType => async dispatch => {
    axios.defaults.headers = {
        'Content-Type': 'application/json',
        Authorization: `Token ${Cookie.get('token')}`
    }
    await axios
        .patch(`/api/v1/contact/${Cookie.get('userId')}/`, {
            email,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
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

export const avatarChange = (
    image: any,
    triggerUrl: string
): ThunkType => async dispatch => {
    axios.defaults.headers = {
        'Content-Type': 'application/json',
        Authorization: `Token ${Cookie.get('token')}`
    }
    const postUrl = `/api/v1/post/?id=${Cookie.get('userId')}`
    let form_data = new FormData();
    form_data.append('avatar', image, image.name);
    await axios
        .patch(triggerUrl, form_data)
        .then(res => {
            dispatch(show('Вы успешно сменили аватар!', 'success'));
            trigger(triggerUrl);
            trigger(postUrl);
        })
        .catch(err => {
            dispatch(show('Ошибка смены аватара!', 'warning'));
            trigger(triggerUrl);
            trigger(postUrl);
        });
};
