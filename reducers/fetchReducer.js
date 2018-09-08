import { FETCH_COUNTRY , FETCHING_DATA, NO_CONNECTION } from '../redux/actions/types';

const initialState = {
    items:[],
    isFetching:false,
    countries:[],
    isConnected:true,
}


export default function(state=initialState,action){
    switch(action.type){
        case FETCHING_DATA:
            return{
                ...state,
                isFetching:true,
            }
        case FETCH_COUNTRY:
            return {
                ...state,
                isFetching:false,
                countries: action.payload,
                
            };
            break;
        case NO_CONNECTION:
            return {
                ...state,
                isConnected:false,
                countries: action.payload,
            };
            break;
        default:
            return state;
    }

}