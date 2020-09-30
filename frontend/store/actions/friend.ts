import { ThunkType } from '@/types/thunk';
import axios from 'axios';
import Router from 'next/router';
import { show } from './alert';

export const addFriend = (friendId: number, userId: number): ThunkType => async dispatch => {
    await axios
        .post('/api/v1/request/add/', {
            sender: userId,
            receiver: friendId
        })
        .then(res => {
            dispatch(show('Вы успешно отправили запрос о добавлении в друзья!', 'success'));
        })
        .catch(err => {
            dispatch(show('Ошибка отправки запроса о добавлении в друзья!', 'warning'));
        });
};

export const recieveFriend = (friendId: number, userId: number): ThunkType => async dispatch => {
    await axios
        .post('/api/v1/friends/add/', {
            sender: friendId,
            receiver: userId,
        })
        .then(res => {
            dispatch(show('Вы успешно добавили в друзья!', 'success'));
        })
        .catch(err => {
            dispatch(show('Ошибка добавления в друзья!', 'warning'));
        });
};

export const removeAddFriend = (friendId: number, userId: number): ThunkType => async dispatch => {
    await axios
        .post('/api/v1/request/remove/', {
            sender: userId,
            receiver: friendId,
        })
        .then(res => {
            dispatch(show('Вы успешно отменили запрос о добавлении в друзья!', 'success'));
        })
        .catch(err => {
            dispatch(show('Ошибка отмены запроса о добавлении в друзья!', 'warning'));
        });
};

export const removeFriend = (friendId: number, userId: number): ThunkType => async dispatch => {
    await axios
        .post('/api/v1/friends/remove/', {
            sender: userId,
            receiver: friendId,
        })
        .then(res => {
            dispatch(show('Вы успешно удалили из друзей!', 'success'));
        })
        .catch(err => {
            dispatch(show('Ошибка удаления друга!', 'warning'));
        });
};

export const createChat = (friendId: number, userId: number): ThunkType => async dispatch => {
    await axios
        .post('/api/v1/chat/', {
            participants: [String(userId), String(friendId)],
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
