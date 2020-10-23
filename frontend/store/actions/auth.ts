import { setNotify, setMessageNotify } from './notify';
import { trigger } from 'swr';
import Cookie from 'js-cookie';
import Router from 'next/router';
import WebSocketInstance from '@/websocket';
import { show } from './alert';
import { ThunkType } from '@/types/thunk';
import { instance, instanceWithOutHeaders } from '@/api/api';

export const authInfo = (isRouterPush: boolean, regToken?: string): ThunkType => async dispatch => {
    const userId = Cookie.get('userId');
    let token = Cookie.get('token');
    if (regToken) {
        token = regToken;
    }
    await instance(token)
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
            if (res.data.num_notifications) {
                dispatch(setNotify(res.data.num_notifications))
            }
            if (res.data.unread) {
                dispatch(setMessageNotify(res.data.unread))
            }
            console.log('Информация успешно занесена в куки');
            if (isRouterPush) {
                Router.push({ pathname: '/dialogs' }, undefined, { shallow: true });
            } else {
                Router.push('/userpage/[userID]', `/userpage/${userId}`, { shallow: true });
            }
        })
        .catch(err => {
            dispatch(show('Ошибка при взятии информации о пользователе!', 'warning'));
        });
};

export const authLogin = (email: string, password: string): ThunkType => async dispatch => {
    await instanceWithOutHeaders
        .post('/auth/jwt/create/', {
            email,
            password,
        })
        .then(res => {
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000 * 24);
            Cookie.set('token', res.data.access);
            console.log(res.data.access)
            console.log(email);
            console.log(password);
            Cookie.set('expirationDate', expirationDate);
            dispatch(authInfo(true));
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
    password: string,
    confirmMethod: 'email' | 'phone',
    country: string,
    city: string,
    date: string,
    status: string
): ThunkType => async dispatch => {
    await instanceWithOutHeaders
        .post('/api/v1/register/ ', {
            email,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            password,
            activation_type: confirmMethod
        })
        .then(res => {
            console.log(res.data.id);
            if (res.data.id) {
                dispatch(authSignupNext(res.data.id, country, city, date, status, confirmMethod, email))
            } else {
                dispatch(show('Что-то пошло не так!', 'warning'));
            }
        })
        .catch(err => {
            dispatch(show('Что-то пошло не так!', 'warning'));
        });
};

export const authSignupNext = (
    id: number,
    country: string,
    city: string,
    date: string,
    status: string,
    confirmMethod: 'email' | 'phone',
    email: string
): ThunkType => async dispatch => {
    await instanceWithOutHeaders
        .post('/api/v1/create_info/', {
            id,
            status,
            birth_date: date,
            country,
            city,
        })
        .then(res => {
            let message = 'На ваш E-mail пришло подтверждение!';
            if (confirmMethod === 'phone') {
                message = 'На ваш телефон пришел код!';
            }
            dispatch(show(message, 'success'));
            Router.push({ pathname: '/register-success', query: { confirmMethod } }, undefined, { shallow: true });
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

export const emailActivate = (token: string): ThunkType => async dispatch => {
    await instanceWithOutHeaders
        .post('/api/v1/activation/email/ ', {
            token,
        })
        .then(res => {
            dispatch(show('Активация прошла успешно! Можете войти в аккаунт!', 'success'));
        })
        .catch(err => {
            dispatch(show('Ошибка активации!', 'warning'));
        });
};

export const phoneActivate = (code: string): ThunkType => async dispatch => {
    await instanceWithOutHeaders
        .post('/api/v1/activation/phone/ ', {
            code
        })
        .then(res => {
            dispatch(show('Активация прошла успешно! Можете войти в аккаунт!', 'success'));
            setTimeout(() => {
                Router.push({ pathname: '/' }, undefined, { shallow: true });
            }, 3000)
        })
        .catch(err => {
            dispatch(show('Неверный код!', 'warning'));
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
    const userId = Cookie.get('userId');
    const token = Cookie.get('token');
    await instance(token)
        .patch(`/api/v1/contact/${userId}/`, {
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
            Router.push('/userpage/[userID]', `/userpage/${userId}`, { shallow: true });
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

    const token = Cookie.get('token');
    const userId = Cookie.get('userId');
    const postUrl = `/api/v1/post/?id=${userId}`

    let form_data = new FormData();
    form_data.append('picture', image, image.name);

    await instance(token)
        .post('api/v1/avatar/', form_data)
        .then(res => {
            dispatch(show('Вы успешно сменили аватар!', 'success'));
            trigger(triggerUrl);
            trigger(postUrl);
            dispatch(authInfo(false));
        })
        .catch(err => {
            dispatch(show('Ошибка смены аватара!', 'warning'));
            trigger(triggerUrl);
            trigger(postUrl);
        });
};
