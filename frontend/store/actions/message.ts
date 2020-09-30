import { IMessages, IMessage } from '@/types/message';
import * as types from '../types';

type SetMessagesSuccessActionType = {
    type: typeof types.SET_MESSAGES
    messages: IMessages
}
export const setMessagesSuccess = (messages: IMessages): SetMessagesSuccessActionType => ({ type: types.SET_MESSAGES, messages });

type SetLoadingFalseActionType = {
    type: typeof types.SET_LOADING_FALSE
}
export const setLoadingFalse = (): SetLoadingFalseActionType => ({ type: types.SET_LOADING_FALSE });

type SetLoadingActionType = {
    type: typeof types.SET_LOADING
}
export const setLoading = (): SetLoadingActionType => ({ type: types.SET_LOADING });

type AddMessageActionType = {
    type: typeof types.ADD_MESSAGE
    message: IMessage
}
export const addMessage = (message: IMessage): AddMessageActionType => ({ type: types.ADD_MESSAGE, message });

export const setMessages = (messages: IMessages) => (dispatch: any) => {
    dispatch(setLoading());
    dispatch(setMessagesSuccess(messages));
    dispatch(setLoadingFalse());
};

export type MessageActionTypes = SetMessagesSuccessActionType | SetLoadingFalseActionType | SetLoadingActionType | AddMessageActionType;