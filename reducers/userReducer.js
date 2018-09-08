import {  GET_PROFILE, POST_DATA, SIGNIN_USER, NO_CONNECTION } from '../redux/actions/types';

const initialState = {
    items:[],
    item:[],
    profile:[],
    isready:false,
    isLoading:true,
}


export default function(state=initialState,action){
    switch(action.type){
        case POST_DATA:
            return {
                ...state,
                items: action.payload
            };
        case SIGNIN_USER:
            return {
                ...state,
                item: action.payload,
                isready:true,
            };
        case GET_PROFILE:
            return {
                ...state,
                profile: action.payload,
                isLoading:false,
            };
        case NO_CONNECTION:
            return {
                ...state,
                item: action.payload,
            };
        default:
            return state;
    }

}