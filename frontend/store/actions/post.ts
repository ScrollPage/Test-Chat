import { ThunkType } from '@/types/thunk';
import { instance } from '@/api/api';
import Cookie from 'js-cookie';
import { show } from './alert';
import { trigger } from 'swr';
import { Dispatch } from 'redux';

export const addPost = (text: string, image: any, triggerUrl: string, pageUserId?: number, partyId?: number,): ThunkType => async (dispatch: Dispatch) => {
    const token = Cookie.get('token');
    const userId: any = Cookie.get('userId');
    let owner = userId;
    if (pageUserId) {
        owner = pageUserId;
    }
    let form_data = new FormData();
    form_data.append('text', text);
    form_data.append('owner', String(owner));
    if (image) {
        form_data.append('image', image, image.name);
    }
    let url = '/api/v1/post/';
    if (partyId) {
        url = `/api/v1/group/offer/${partyId}/`
    }
    await instance(token)
        .post(url, form_data)
        .then(res => {
            dispatch(show('Пост успешно добавлен!', 'success'));
            trigger(triggerUrl);
        })
        .catch(err => {
            dispatch(show('Ошибка в добавлении поста!', 'warning'));
            trigger(triggerUrl);
        });
};

export const deletePost = (postId: number, triggerUrl: string): ThunkType => async (dispatch: Dispatch) => {
    console.log(triggerUrl);
    const token = Cookie.get('token');
    await instance(token)
        .delete(`/api/v1/post/${postId}/`)
        .then(res => {
            dispatch(show('Пост успешно удален!', 'success'));
            trigger(triggerUrl);
        })
        .catch(err => {
            dispatch(show('Ошибка в удалении поста!', 'warning'));
            trigger(triggerUrl);
        });
};

export const rePost = (text: string, image: any, parent: number, triggerUrl: string): ThunkType => async (dispatch: Dispatch) => {
    const token = Cookie.get('token');
    const userId: any = Cookie.get('userId');
    let form_data = new FormData();
    form_data.append('text', text);
    form_data.append('owner', userId);
    form_data.append('parent', String(parent));
    if (image) {
        form_data.append('image', image, image.name);
    }
    await instance(token)
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

export const addPostLike = (postId: number): ThunkType => async (dispatch: Dispatch) => {
    const token = Cookie.get('token');
    await instance(token)
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

export const removePostLike = (postId: number): ThunkType => async (dispatch: Dispatch) => {
    const token = Cookie.get('token');
    await instance(token)
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

export const acceptPost = (partyId: number, postId: number, triggerUrl: string): ThunkType => async (dispatch: Dispatch) => {
    const token = Cookie.get('token');
    const url = `/api/v1/group/accept/${partyId}/`;
    await instance(token)
        .put(url, {
            some_id: postId
        })
        .then(res => {
            dispatch(show('Пост успешно добавлен в группу!', 'success'));
            trigger(triggerUrl);
            trigger(url);
        })
        .catch(err => {
            dispatch(show('Ошибка в добавлении поста в группу!', 'warning'));
            trigger(triggerUrl);
            trigger(url);
        });
};

export const addViewPost = (postId: number): ThunkType => async (dispatch: Dispatch) => {
    const token = Cookie.get('token');
    const url = `/api/v1/score/`;
    await instance(token)
        .post(url, {
            post_id: postId
        })
        .then(res => {
            console.log('Пост просмотрен')
        })
        .catch(err => {
            console.log('Ошибка в просмотре поста')
        });
};
