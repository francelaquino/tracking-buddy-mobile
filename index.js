/** @format */

import {name as appName} from './app.json';
import bgMessaging from './bgMessaging'; 
import  React  from 'react';
import { View,StatusBar, AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import store from './store';
import { Stack }  from './components/shared/Navigation';




const tracking =()=>(
    <Provider store={store}>
            <Stack />
    </Provider>
)

AppRegistry.registerComponent('trackingbuddyv3', () => tracking);

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); 