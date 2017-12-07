import { combineReducers } from 'redux';
import fetch from './fetch';
import user from './user';
import entities from './entities'

export default combineReducers({
    fetch,
    user,
    //entities,
});