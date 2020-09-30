import * as types from '../types';

type ModalShowType = {
  type: typeof types.MODAL_SHOW,
  modalName: ModalNameType,
  modalProps: any
}
export type ModalNameType = 'post_modal' | 'comment_modal' | 'create_post_modal' | null;
export const modalShow = (modalName: ModalNameType, modalProps: any): ModalShowType => ({ type: types.MODAL_SHOW, modalName, modalProps });

type ModalHideType = {
  type: typeof types.MODAL_HIDE
}
export const modalHide = (): ModalHideType => ({ type: types.MODAL_HIDE });

export type ModalActionTypes =  ModalShowType | ModalHideType; 
