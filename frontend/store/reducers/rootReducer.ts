import { notifyReducer } from './notify';
import { modalReducer } from './modal';
import { combineReducers } from 'redux';
import { alertReducer } from './alert';
import { messageReducer } from './message';
import { searchReducer } from './search';

export let rootReducer = combineReducers({
    alert: alertReducer,
    message: messageReducer,
    search: searchReducer,
    modal: modalReducer,
    notify: notifyReducer
});

type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>;


