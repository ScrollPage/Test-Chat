import { IMessages, IMessage } from '@/types/message';

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
