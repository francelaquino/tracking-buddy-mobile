import { DISPLAY_MESSAGES, DISPLAY_LOCATION_MAP, DISPLAY_LOCATION_TRACK ,DISPLAY_LOCATION_LIST,DISPLAY_LOCATION, GET_LOCATIONDETAILS, SAVE_LOCATION_OFFLINE, SAVE_LOCATION_ONLINE, DISPLAY_PLACES, GET_PLACE_ALERT } from '../redux/actions/types';

const initialState = {
    coordinates:[],
    places:[],
    locations: [],
    locationslist: [],
    locationsmap: [],
    locationstrack: [],
    location: [],
    messages:[],
    details:[],
    alerts: [],
    address:'',
    isLoading:true,
    success:true,
}


export default function(state=initialState,action){
    switch (action.type) {
        
        case DISPLAY_MESSAGES:
            return {
                ...state,
                messages: action.payload,
                isLoading:false,
            };
        case DISPLAY_LOCATION_MAP:
            return {
                ...state,
                locationsmap: action.payload,
                isLoading: false,
            };
        case DISPLAY_LOCATION_TRACK:
            return {
                ...state,
                locationstrack: action.payload,
                isLoading: false,
            };
        case DISPLAY_LOCATION_LIST:
            return {
                ...state,
                locationslist: action.payload,
                isLoading: false,
            };
        case DISPLAY_LOCATION:
            return {
                ...state,
                locations: action.payload,
                isLoading: false,
            };
        case GET_LOCATIONDETAILS:
            return {
                ...state,
                details: action.payload,
                isLoading: false,
            };
        case DISPLAY_PLACES:
            return {
                ...state,
                places: action.payload,
                isLoading:false,
            };
        case GET_PLACE_ALERT:
            return {
                ...state,
                alerts: action.payload,
                isLoading:false,
            };
        case SAVE_LOCATION_OFFLINE:
            return {
                ...state,
                coordinates: state.coordinates.concat(action.payload),
            };
        case SAVE_LOCATION_ONLINE:
            return {
                ...state,
                address: action.payload,
            };
       

        default:
            return state;
    }

}