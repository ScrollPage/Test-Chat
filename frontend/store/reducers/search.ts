import { SearchActionTypes } from './../actions/search';
import * as types from '../types';

const initialState = {
    search: ""
};

type InititalStateType = typeof initialState;

export const searchReducer = (state = initialState, action: SearchActionTypes): InititalStateType=> {
    switch (action.type) {
        case types.SET_SEARCH:
            return { ...state, search: action.search }
        default:
            return state;
    }
}


