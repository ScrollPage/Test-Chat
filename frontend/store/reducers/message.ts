import { MessageActionTypes } from './../actions/message';
import { IMessages } from '@/types/message';
import * as types from '../types';

const initialState = {
    messages: [] as IMessages,
    loading: false,
};

type InititalStateType = typeof initialState;

export const messageReducer = (state = initialState, action: MessageActionTypes): InititalStateType => {
    switch (action.type) {
        case types.ADD_MESSAGE:
            return { ...state,  messages: [...state.messages, action.message] }
        case types.SET_MESSAGES:
            return { ...state, messages: action.messages.reverse() }
        case types.SET_LOADING_FALSE:
            return { ...state, loading: false }
        case types.SET_LOADING:
            return { ...state, loading: true }
        default:
            return state;
    }
}
