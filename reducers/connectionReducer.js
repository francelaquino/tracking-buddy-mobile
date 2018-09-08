import { CONNECTION_STATE, GET_CONNECTION } from '../redux/actions/types';

const initialState = {
    isConnected:true,
}


export default function(state=initialState,action){
    switch(action.type){
        case CONNECTION_STATE:
            return{
                ...state,
                isConnected:action.payload,
            }
        case GET_CONNECTION:
            return{
                ...state,
                isConnected:action.payload,
            }
      
        default:
            return state;
    }

}