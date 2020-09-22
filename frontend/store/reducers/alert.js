import * as types from '../types';

const initialState = {
    text: null,
    typeOf: 'success',
};

const handlers = {
    [types.ALERT_SHOW]: (state, { text, typeOf }) => ({
        ...state,
        text,
        typeOf,
    }),
    [types.ALERT_HIDE]: state => ({ ...state, text: null }),
    DEFAULT: state => state,
};

export const alertReducer = (state = initialState, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action);
};
