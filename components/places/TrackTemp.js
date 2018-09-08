
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { Content,Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Right } from 'native-base';
import EditGroup from '../group/EditGroup';
import AddMember from '../group/AddMember';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { TabNavigator } from 'react-navigation';


const styles = StyleSheet.create({
	tab: {
		padding: 0
	},
	indicator: {
		width: 0,
		height: 0
	},
	label: {
        fontSize: 13,
        marginTop:2,
        marginBottom:2,
	},
	tabBar: {
		backgroundColor: '#1eaec5',
	}
});

let routeConfig={
    EditGroup: { 
        screen: EditGroup,
        navigationOptions: ({ navigation }) => ({
            title: "Edit Group",
            tabBarIcon: ({ tintColor }) =>  <SimpleLineIcons style={{color:'white',fontSize:21,margin:0, padding:0}} name="user" />
        })
    },
    AddMember:{
        screen:AddMember,
        navigationOptions: ({ navigation }) => ({
            title: "Members",
            tabBarIcon: ({ tintColor }) =>  <SimpleLineIcons  style={{color:'white',fontSize:21,margin:0, padding:0}} name="location-pin"/>
        })
    },
    MemberMessage:{
        screen:AddMember,
        navigationOptions: ({ navigation }) => ({
            title: "Message",
            tabBarIcon: ({ tintColor }) =>  <MaterialIcons  style={{color:'white',fontSize:21,margin:0, padding:0}} name="chat-bubble-outline"/>
        })
    }
}

let tabNavConfig={
    tabBarPosition:'bottom',
    animationEnabled: true,
		swipeEnabled: true,
		animationEnabled: true,
		lazy: true,
		backBehavior: "initialRoute",
		tabBarOptions: {
            activeTintColor: 'white',
			showLabel: true,
			showIcon: true,
			upperCaseLabel: false,
            scrollEnabled: false,
            tabStyle: styles.tab,
			indicatorStyle: styles.indicator,
			labelStyle: styles.label,
			iconStyle: styles.icon,
			style: styles.tabBar
		}
}



export default TabNavigator(routeConfig,tabNavConfig);;
  