import {  CREATE_GROUP, DISPLAY_GROUP, DELETE_GROUP, UPDATE_GROUP } from '../redux/actions/types';

const initialState = {
    groups:[],
    isLoading:true,
    success:true,
}


export default function(state=initialState,action){
    switch(action.type){
        case CREATE_GROUP:
            return {
                ...state,
                items: action.payload
            };
        case DISPLAY_GROUP:
            return{
                ...state,
                groups:action.payload,
                isLoading:false,
            };
        case DELETE_GROUP:
            return{
                ...state,
                items:action.payload
            };
        case UPDATE_GROUP:
            return{
                ...state,
                items:action.payload
            };
        default:
            return state;
    }

}

