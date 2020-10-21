import { PropertiesType } from '@/types/actions';
import * as actions from './../actions/notify';
import Cookie from 'js-cookie';

const initialState = {
  notify: Cookie.get('notify') === undefined ? 0 : Number(Cookie.get('notify'))
};

type InititalStateType = typeof initialState;

type AlertActionsTypes = ReturnType<PropertiesType<typeof actions>>

export const notifyReducer = (state = initialState, action: AlertActionsTypes): InititalStateType => {
  switch (action.type) {
    case 'ADD_NOTIFY':
      return { ...state, notify: state.notify + 1 }
    case 'ZEROING_NOTIFY':
      return { ...state, notify: 0 }
    case 'SET_NOTIFY':
      return {...state, notify: action.setNumber}
    default:
      return state;
  }
}

