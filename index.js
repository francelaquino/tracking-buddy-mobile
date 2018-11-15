/** @format */

import {name as appName} from './app.json';
import bgMessaging from './bgMessaging'; 
import  React  from 'react';
import { View,StatusBar, AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import store from './store';
import { Stack }  from './components/shared/Navigation';
import BackgroundGeolocation from "react-native-background-geolocation";

let StartTracking = async () => {
    return new Promise((resolve) => {
        setTimeout(async()=>{
            BackgroundGeolocation.start();
            resolve();
        },30000);
    });
}


let HeadlessTask = async (event) => {
    let params = event.params;
         console.log(event.name)
    
    switch (event.name) {
      case 'heartbeat':
        BackgroundGeolocation.stop();
        await StartTracking();
        
        break;
      
    }
  }


const tracking =()=>(
    <Provider store={store}>
            <Stack />
    </Provider>
)


AppRegistry.registerComponent('trackingbuddyv3', () => tracking);

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); 

BackgroundGeolocation.registerHeadlessTask(HeadlessTask);
