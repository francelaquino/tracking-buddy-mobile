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
        <View style={{flex:1}}>
            <StatusBar backgroundColor="#16a085" />
            <Stack />
            </View>
    </Provider>
)

AppRegistry.registerComponent('trackingbuddyv3', () => tracking);

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); 