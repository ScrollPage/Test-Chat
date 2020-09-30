import { ModalActionTypes, ModalNameType } from './../actions/modal';
import * as types from '../types';

const initialState = {
  modalName: null as ModalNameType,
  modalProps: {} as any
};

type InititalStateType = typeof initialState;

export const modalReducer = (state = initialState, action: ModalActionTypes): InititalStateType => {
  switch (action.type) {
    case types.MODAL_SHOW:
      return { ...state, modalName: action.modalName, modalProps: action.modalProps }
    case types.MODAL_HIDE:
      return initialState
    default:
      return state;
  }
}


