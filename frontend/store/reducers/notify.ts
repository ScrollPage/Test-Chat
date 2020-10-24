import { PropertiesType } from '@/types/actions';
import * as actions from './../actions/notify';
import Cookie from 'js-cookie';

const initialState = {
  notify: Cookie.get('notify') === undefined ? 0 : Number(Cookie.get('notify')),
  messageNotify: Cookie.get('messageNotify') === undefined ? 0 : Number(Cookie.get('messageNotify'))
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
      return { ...state, notify: action.setNumber }
    case 'ADD_MESSAGE_NOTIFY':
      return { ...state, messageNotify: state.messageNotify + 1 }
    case 'REMOVE_MESSAGE_NOTIFY':
      return { ...state, messageNotify: state.messageNotify - 1 }
    case 'SET_MESSAGE_NOTIFY':
      return { ...state, messageNotify: action.setNumber }
    default:
      return state;
  }
}

