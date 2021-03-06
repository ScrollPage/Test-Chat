import { AppStateType } from './reducers/rootReducer';

export const getAlertType = (state: AppStateType) => {
  return state.alert.typeOf
}

export const getAlertText = (state: AppStateType) => {
  return state.alert.text
}

export const getAlertIsNotClose = (state: AppStateType) => {
  return state.alert.IsNotClose
}

export const getSearch = (state: AppStateType) => {
  return state.search.search
}

export const getMessages = (state: AppStateType) => {
  return state.message.messages
}

export const getMessagesLoading = (state: AppStateType) => {
  return state.message.loading
}

export const getModalName = (state: AppStateType) => {
  return state.modal.modalName
}

export const getModalProps = (state: AppStateType) => {
  return state.modal.modalProps
}

export const getNotify = (state: AppStateType) => {
  return state.notify.notify
}

export const getMessageNotify = (state: AppStateType) => {
  return state.notify.messageNotify
}