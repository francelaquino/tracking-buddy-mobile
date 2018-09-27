import React, { Component } from 'react';
import Register from '../user/Registration';
import UserProfile from '../user/UserProfile';
import Login from '../user/Login';
import ForgotPassword from '../user/ForgotPassword';
import CreateGroup from '../group/CreateGroup';
import EditGroup from '../group/EditGroup';
import DisplayGroup from '../group/DisplayGroup';
import SelectGroup from '../group/SelectGroup';
import DisplayHomeGroup from '../group/DisplayHomeGroup';
import MembersGroup from '../group/MembersGroup';
import AddMember from '../group/AddMember';
import DisplayMember from '../member/DisplayMember';
import GenerateInviteCode from '../member/GenerateInviteCode';
import InfoMember from '../member/InfoMember';
import SavePlace from '../places/SavePlace';
import EditSavePlace from '../places/EditSavePlace';
import GroupHome from '../group/GroupHome';
import ProfileHome from '../user/ProfileHome';
import NewInvite from '../member/NewInvite';
import Home from '../places/Home';
import CreatePlace from '../places/CreatePlace';
import EditCreatePlace from '../places/EditCreatePlace';
import PlaceList from '../places/PlaceList';
import LocationsMember from '../places/LocationsMember';
import PlaceView from '../places/PlaceView';
import LocationPlaces from '../places/LocationPlaces';
import LocationDetails from '../places/LocationDetails';
import LocationView from '../places/LocationView';
import PlaceAlert from '../places/PlaceAlert';
import HomeSettings from '../settings/HomeSettings';
import ChangePassword from '../user/ChangePassword';
import PlaceNotifications from '../places/PlaceNotifications';
import Menu from '../shared/Menu';
import Splash from './Splash';

import  { createStackNavigator }  from 'react-navigation';


export const Stack = createStackNavigator({

    CreatePlace: {
        screen: CreatePlace,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },

    Splash: {
        screen: Splash,
        headerMode: 'none',
        navigationOptions: {
            header: null
        },

    },

    PlaceNotifications: {
        screen: PlaceNotifications,
        headerMode: 'none',
        navigationOptions: {
            header: null
        },

    },


    

    Home: {
        screen: Home,
        headerMode: 'none',
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        }
    },

    LocationPlaces: {
        screen: LocationPlaces,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },



    LocationDetails: {
        screen: LocationDetails,
        headerMode: 'none',
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        }
    },






    Login: {
        screen: Login,
        headerMode: 'none',
        navigationOptions: {
            header: null
        },

    },

    Register: {
        screen: Register,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },




    Menu: {
        screen: Menu,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },
    

    LocationsMember: {
        screen: LocationsMember,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },

   
    PlaceList: {
        screen: PlaceList,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },

    

    EditCreatePlace: {
        screen: EditCreatePlace,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },

   

    DisplayMember: {
        screen: DisplayMember,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },

    InfoMember: {
        screen: InfoMember,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },

    

  



    SavePlace: {
        screen: SavePlace,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },

    EditSavePlace: {
        screen: EditSavePlace,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },

    UserProfile: {
        screen: UserProfile,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },

   



    DisplayGroup: {
        screen: DisplayGroup,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },

   

   


    AddMember: {
        screen: AddMember,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },

   


    GroupHome: {
        screen: GroupHome,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },

    
    CreateGroup: {
        screen: CreateGroup,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },

    

    ProfileHome: {
        screen: ProfileHome,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },


   

   

    NewInvite: {
        screen: NewInvite,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },
   
    



    HomeSettings: {
        screen: HomeSettings,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },

    

    
   

   
   
   

   
    ForgotPassword: { 
        screen: ForgotPassword,
        headerMode: 'none',
        navigationOptions: {
            header: null
        },
        
    },
   
    
    ChangePassword: { 
        screen: ChangePassword,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },
    
   
   
 
    LocationView: { 
        screen: LocationView,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },


    PlaceAlert: { 
        screen: PlaceAlert,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },


    PlaceView: { 
        screen: PlaceView,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    },

   
   
   
    
   
 
   

    
   
   
    
   
  
    
   
    
    
    GenerateInviteCode: { 
        screen: GenerateInviteCode,
        headerMode: 'none',
        navigationOptions: {
            header: null
        } 
    },
    

   
   

   
   
  
    
    SelectGroup: { 
        screen: SelectGroup,
        headerMode: 'none',
        navigationOptions: {
            header: null
        },
        
    },
   /*
    
    AddMemberGroup: { 
        screen: AddMember,
        headerMode: 'none',
        navigationOptions: {
            header: null
        } 
    },*/
   
  
   
  
    
   
    
    
  
    DisplayHomeGroup: { 
        screen: DisplayHomeGroup,
        headerMode: 'none',
        navigationOptions: {
            header: null
        } 
    },
   
    
    /*
    
    InfoMember: { 
        screen: InfoMember,
        headerMode: 'none',
        navigationOptions: {
            header: null
        } 
    },*/
   
    
    
    EditGroup: { 
        screen: EditGroup,
        headerMode: 'none',
        navigationOptions: {
            header: null
        } 
    },
    MembersGroup: { 
        screen: MembersGroup,
        headerMode: 'none',
        navigationOptions: {
            header: null
        } 
    },initialRouteName: 'Home'

  });



/*
  
let routeConfig={
    InfoMember: { 
        screen: InfoMember,
    },
    LocationPlaces: { 
        screen: LocationPlaces,
    },
}

let tabNavConfig={
    tabBarPosition:'top',
    animationEnabled: true,
}

export const MemberTab = TabNavigator(routeConfig,tabNavConfig);*/