import { trigger } from 'swr';
import Cookie from 'js-cookie';
import { ThunkType } from '@/types/thunk';
import { instance } from '@/api/api';
import Router from 'next/router';
import { show } from './alert';

export const addFriend = (friendId: number, triggerUrl: string): ThunkType => async dispatch => {
    const token = Cookie.get('token');
    await instance(token)
        .post('/api/v1/request/add/', {
            receiver: friendId
        })
        .then(res => {
            dispatch(show('Вы успешно отправили запрос о добавлении в друзья!', 'success'));
            trigger(triggerUrl);
        })
        .catch(err => {
            dispatch(show('Ошибка отправки запроса о добавлении в друзья!', 'warning'));
            trigger(triggerUrl);

        });
};

export const recieveFriend = (friendId: number, userId: number, triggerUrl: string): ThunkType => async dispatch => {
    const token = Cookie.get('token');
    await instance(token)
        .post('/api/v1/friends/add/', {
            sender: friendId,
            receiver: userId,
        })
        .then(res => {
            dispatch(show('Вы успешно добавили в друзья!', 'success'));
            trigger(triggerUrl);
        })
        .catch(err => {
            dispatch(show('Ошибка добавления в друзья!', 'warning'));
            trigger(triggerUrl);
        });
};

export const removeAddFriend = (friendId: number, userId: number, triggerUrl: string): ThunkType => async dispatch => {
    const token = Cookie.get('token');
    await instance(token)
        .post('/api/v1/request/remove/', {
            sender: userId,
            receiver: friendId,
        })
        .then(res => {
            dispatch(show('Вы успешно отменили запрос о добавлении в друзья!', 'success'));
            trigger(triggerUrl);
        })
        .catch(err => {
            dispatch(show('Ошибка отмены запроса о добавлении в друзья!', 'warning'));
            trigger(triggerUrl);
        });
};

export const removeFriend = (friendId: number, userId: number, triggerUrl: string): ThunkType => async dispatch => {
    const token = Cookie.get('token');
    await instance(token)
        .post('/api/v1/friends/remove/', {
            sender: userId,
            receiver: friendId,
        })
        .then(res => {
            dispatch(show('Вы успешно удалили из друзей!', 'success'));
            trigger(triggerUrl);
        })
        .catch(err => {
            dispatch(show('Ошибка удаления друга!', 'warning'));
            trigger(triggerUrl);
        });
};

export const createChat = (friendId: number): ThunkType => async dispatch => {
    const token = Cookie.get('token');
    await instance(token)
        .post('/api/v1/chat/', {
            participants: [Cookie.get('userId'), String(friendId)],
        })
        .then(res => {
            Router.push('/dialogs/[chatID]', `/dialogs/${res.data.id}`, {
                shallow: true,
            });
            dispatch(show('Вы успешно создали чат!', 'success'));
        })
        .catch(err => {
            dispatch(show('Ошибка создания чата!', 'warning'));
        });
};
