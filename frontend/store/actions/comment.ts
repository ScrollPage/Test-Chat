import Cookie from 'js-cookie';
import { trigger } from 'swr';
import { ThunkType } from '@/types/thunk';
import { instance } from '@/api/api';
import { show } from './alert';

export const addComment = (commentText: string, postId: number, triggerUrl: string): ThunkType => async dispatch => {
    const token = Cookie.get('token');
    await instance(token)
        .post('/api/v1/comment/post/', {
            text: commentText,
            image: null,
            parent: null,
            id: postId
        })
        .then(res => {
            trigger(triggerUrl);
            dispatch(show('Вы успешно добавили комментарий!', 'success'));
        })
        .catch(err => {
            dispatch(show('Ошибка в добавлении комментария!', 'warning'));
        });
};

export const deleteComment = (commentId: number): ThunkType => async dispatch => {
    const token = Cookie.get('token');
    await instance(token)
        .delete(`/api/v1/comment/${commentId}/`)
        .then(res => {
            dispatch(show('Вы успешно удалили комментарий!', 'success'));
        })
        .catch(err => {
            dispatch(show('Ошибка в удалении комментария!', 'warning'));
        });
};