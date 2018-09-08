import { GET_INVITATIONCODE, GET_MEMBERNOTIFICATION,  GET_MEMBERGROUP, CLEAR_HOME_MEMBERS, GENERATE_INVITATIONCODE, GET_COUNTRIES, DISPLAY_MEMBER,INVITE_MEMBER, GET_MEMBER, DELETE_MEMBER,DISPLAY_HOME_MARKER, DISPLAY_HOME_MEMBER, DISPLAY_GROUP_MEMBER } from '../redux/actions/types';

const initialState = {
    members:[],
    countries:[],
    member: [],
    placenotification: [],
    membergroups: [],
    home_members:[],
    home_markers:[],
    invitationcode:[],
    isLoading:true,
    success:true,
}

export default function (state = initialState, action) {
    switch (action.type) {
        
       
        case GET_MEMBERNOTIFICATION:
            return {
                ...state,
                placenotification: action.payload,
                isLoading:false,
            };
        case DISPLAY_MEMBER:
            return {
                ...state,
                members: action.payload,
                isLoading: false,
            };
        case GET_MEMBERGROUP:
            return {
                ...state,
                membergroups: action.payload,
                isLoading: false,
            };
       case CLEAR_HOME_MEMBERS:
            return {
                ...state,
                home_members: action.payload,
            };
        case DISPLAY_HOME_MEMBER:
            return {
                ...state,
                home_members: action.payload,
                isLoading:false,
            };
        case DISPLAY_HOME_MARKER:
            return {
                ...state,
                home_markers: action.payload,
            };
        case GET_INVITATIONCODE:
            return {
                ...state,
                invitationcode: action.payload,
                isLoading:false,
            };
            
        case DISPLAY_GROUP_MEMBER:
            return {
                ...state,
                members: action.payload,
                isLoading:false,
            }
        case GET_MEMBER:
            return {
                ...state,
                member: action.payload,
                isLoading:false,
            };
        case GET_COUNTRIES:
            return {
                ...state,
                countries: action.payload,
            };
        case DELETE_MEMBER:
            return {
                ...state,
                members: action.payload,
            };
        default:
            return state;
    }

}