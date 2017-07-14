import {combineReducers} from 'redux';
import createReducer from './../lib/create-reducer';
import {onResizeScreen} from './action';
const viewConst = require('./const.json');

export default combineReducers({
    screen: createReducer(onResizeScreen().payload, viewConst.type.resize)
});
