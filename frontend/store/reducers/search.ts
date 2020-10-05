import * as search from './../actions/search';
import { PropertiesType } from '@/types/actions';

const initialState = {
    search: ""
};

type InititalStateType = typeof initialState;

type SearchActionTypes = ReturnType<PropertiesType<typeof search>>

export const searchReducer = (state = initialState, action: SearchActionTypes): InititalStateType=> {
    switch (action.type) {
        case 'SET_SEARCH':
            return { ...state, search: action.search }
        default:
            return state;
    }
}


