import { combineReducers } from 'redux';
import { alertReducer } from './alert';
import { authReducer } from './auth';
import { messageReducer } from './message';
import { searchReducer } from './search';

export default combineReducers({
    alert: alertReducer,
    auth: authReducer,
    message: messageReducer,
    search: searchReducer
});
