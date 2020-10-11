import { ThunkType } from '@/types/thunk';
import axios from 'axios';
import Cookie from 'js-cookie';
import { show } from './alert';
import { trigger } from 'swr';

export const addPost = (text: string, image: any, triggerUrl: string, pageUserId?: number): ThunkType => async dispatch => {
    let form_data = new FormData();
    if (image) {
        form_data.append('image', image, image.name);
    }
    form_data.append('text', text);
    const userId: any = Cookie.get('userId');
    form_data.append('user', userId);
    let owner = userId;
    if (pageUserId) {
        owner = pageUserId;
    }
    form_data.append('owner', String(owner));
    await axios
        .post('/api/v1/post/', form_data)
        .then(res => {
            dispatch(show('Пост успешно добавлен!', 'success'));
            trigger(triggerUrl);
        })
        .catch(err => {
            dispatch(show('Ошибка в добавлении поста!', 'warning'));
            trigger(triggerUrl);
        });
};

export const deletePost = (postId: number): ThunkType => async dispatch => {
    await axios
        .delete(`/api/v1/post/${postId}/`)
        .then(res => {
            dispatch(show('Пост успешно удален!', 'success'));
        })
        .catch(err => {
            dispatch(show('Ошибка в удалении поста!', 'warning'));
        });
};

export const rePost = (text: string, image: any, parent: number, triggerUrl: string): ThunkType => async dispatch => {
    console.log(image);

    let form_data = new FormData();
    if (image) {
        form_data.append('image', image, image.name);
    }
    form_data.append('text', text);
    const userId: any = Cookie.get('userId');
    // form_data.append('user', userId);
    form_data.append('owner', userId);
    form_data.append('parent', String(parent));

    await axios
        .post('/api/v1/repost/', form_data)
        .then(res => {
            dispatch(show('Вы успешно репостнули пост!', 'success'));
            trigger(triggerUrl);
        })
        .catch(err => {
            dispatch(show('Ошибка в репосте поста!', 'warning'));
            trigger(triggerUrl);
        });
};

export const addPostLike = (postId: number): ThunkType => async dispatch => {
    await axios
        .post('/api/v1/like/post/add/', {
            some_id: postId,
        })
        .then(res => {
            dispatch(show('Лайк успешно добавлен!', 'success'));
        })
        .catch(err => {
            dispatch(show('Ошибка в добавлении лайка!', 'warning'));
        });
};

export const removePostLike = (postId: number): ThunkType => async dispatch => {
    await axios
        .post('/api/v1/like/post/remove/', {
            some_id: postId,
        })
        .then(res => {
            dispatch(show('Лайк успешно убран!', 'success'));
        })
        .catch(err => {
            dispatch(show('Ошибка в убирании лайка!', 'warning'));
        });
};
