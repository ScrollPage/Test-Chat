import { trigger } from 'swr';
import { ThunkType } from '@/types/thunk';
import axios from 'axios';
import { show } from './alert';

export const addComment = (commentText: string, postId: number, parent: number | null, triggerUrl: string): ThunkType => async dispatch => {
    await axios
        .post('/api/v1/comment/post/', {
            text: commentText,
            image: null,
            parent: parent,
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
    await axios
        .delete(`/api/v1/comment/${commentId}/`)
        .then(res => {
            dispatch(show('Вы успешно удалили комментарий!', 'success'));
        })
        .catch(err => {
            dispatch(show('Ошибка в удалении комментария!', 'warning'));
        });
};