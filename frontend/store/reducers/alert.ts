import * as types from './../types';
import { AlertActionTypes } from '../actions/alert';

const initialState = {
    text: null as string | null,
    typeOf: 'success'
};

type InititalStateType = typeof initialState;

export const alertReducer = (state = initialState, action: AlertActionTypes): InititalStateType => {
    switch (action.type) {
        case types.ALERT_SHOW:
            return { ...state, text: action.text, typeOf: action.typeOf }
        case types.ALERT_HIDE:
            return { ...state, text: null }
        default:
            return state;
    }
}