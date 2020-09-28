import * as types from '../types';

type HideActionType = {
    type: typeof types.ALERT_HIDE
}
export const hide = (): HideActionType => ({ type: types.ALERT_HIDE });

type typeOfType = 'success' | 'warning' | 'info' | 'error'

type ShowActionType = {
    type: typeof types.ALERT_SHOW
    text: string
    typeOf: typeOfType
}
export const show = (text: string, typeOf: typeOfType = 'success'): ShowActionType => ({ type: types.ALERT_SHOW, text, typeOf });

export type AlertActionTypes = ShowActionType | HideActionType; 

    

