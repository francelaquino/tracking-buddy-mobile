import { combineReducers } from 'redux';
import  fetchReducer from './fetchReducer';
import groupReducer from './groupReducer';
import memberReducer from './memberReducer';
import userReducer from './userReducer';
import locationReducer from './locationReducer';
import connectionReducer from './connectionReducer';
export default combineReducers({
    fetchItem: fetchReducer,
    fetchGroup: groupReducer,
    fetchMember: memberReducer,
    fetchUser: userReducer,
    fetchLocation: locationReducer,
    fetchConnection: connectionReducer
});