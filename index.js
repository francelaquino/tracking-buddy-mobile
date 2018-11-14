/** @format */

import {name as appName} from './app.json';
import bgMessaging from './bgMessaging'; 
import bgHeartbeat from './bgHeartbeat'; 
import  React  from 'react';
import { View,StatusBar, AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import store from './store';
import { Stack }  from './components/shared/Navigation';
import BackgroundGeolocation from "react-native-background-geolocation";



/*
setTimeout(() => {
    console.log("1")
    //BackgroundGeolocation.start();
}, 20000);
setInterval(async function myTimer() {
   console.log("1");
}, 6000);*/
let HeadlessTask = async (event) => {
    let params = event.params;
    
    /*switch (event.name) {
        
      case 'heartbeat':
      console.log(event.name)
        console.log("heartbeat");
        break;
        case 'motionchange':
            console.log("motionchange");
        break;
    }*/
  }


const tracking =()=>(
    <Provider store={store}>
            <Stack />
    </Provider>
)


AppRegistry.registerComponent('trackingbuddyv3', () => tracking);

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); 

//BackgroundGeolocation.registerHeadlessTask(HeadlessTask);
