import { instance } from '@/api/api';
import { show } from '@/store/actions/alert';
import { ThunkType } from '@/types/thunk';
import { IMessages, IMessage } from '@/types/message';
import { Dispatch } from 'redux';
import Cookie from 'js-cookie';

export const message = {
    setMessagesSuccess: (messages: IMessages) => ({ type: 'SET_MESSAGES', messages } as const),
    setLoadingFalse: () => ({ type: 'SET_LOADING_FALSE' } as const),
    setLoading: () => ({ type: 'SET_LOADING' } as const),
    addMessage: (message: IMessage) => ({ type: 'ADD_MESSAGE', message } as const)
}

export const setMessages = (messages: IMessages) => (dispatch: any) => {
    dispatch(message.setLoading());
    dispatch(message.setMessagesSuccess(messages));
    dispatch(message.setLoadingFalse());
};

export const readChat = (chatId: number): ThunkType => async (dispatch: Dispatch) => {
    const token = Cookie.get('token');
    await instance(token)
        .put(`/api/v1/chat/read/${chatId}/`)
        .then(res => {
            // dispatch(show('Вы успешно удалили из друзей!', 'success'));
        })
        .catch(err => {
            // dispatch(show('Ошибка удаления друга!', 'warning'));
        });
}
