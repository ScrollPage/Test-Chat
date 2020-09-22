import * as types from '../types';

export const hide = () => ({ type: types.ALERT_HIDE });

export const show = (text, typeOf = 'success') => ({
    type: types.ALERT_SHOW,
    text,
    typeOf,
});
