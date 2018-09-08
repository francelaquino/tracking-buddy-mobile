
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { Content,Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Right, Tabs, TabHeading, Tab } from 'native-base';
import UserProfile from '../user/UserProfile';
import LocationPlaces from '../places/LocationPlaces';
import OfflineNotice  from '../shared/OfflineNotice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
var userdetails = require('../../components/shared/userDetails');
var globalStyle = require('../../assets/style/GlobalStyle');


class ProfileHome extends Component {
    constructor(props) {
        super(props)
	  }
	  
    render() {
        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                <OfflineNotice/>
                    <Header hasTabs style={globalStyle.header}>
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={()=> {this.props.navigation.goBack()}} >
                                <Icon size={30} name='arrow-back' />
                            </Button> 
                        </Left>
                        <Body >
                            <Title>{userdetails.firstname}</Title>
                        </Body>
                       
                    </Header>
                            <Tabs tabBarPosition="top" tabBarUnderlineStyle={{borderBottomWidth:2,borderBottomColor:'#16a085'}} >
                            <Tab  heading={<TabHeading style={{backgroundColor: 'white'}}>
                                <Text style={{color: '#16a085',fontSize:16}}>Profile</Text>
                                </TabHeading>}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <UserProfile/>
                                </ScrollView>
                                
                                
                            </Tab>
                            <Tab  heading={<TabHeading style={{backgroundColor: 'white'}}>
                                <Text style={{color: '#16a085',fontSize:16}}>Locations</Text>
                                </TabHeading>}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                <LocationPlaces memberid={userdetails.userid} navigate={this.props.navigation.navigate}/>
                                </ScrollView>
                            </Tab>
                            </Tabs>
                            
                </Container>
            </Root>
           
        )
    }
    
}

export default ProfileHome;