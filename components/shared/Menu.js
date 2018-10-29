
import React, { Component } from 'react';
import { Linking, StatusBar, AsyncStorage, Platform, StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ToastAndroid, } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Right, Content, List, ListItem } from 'native-base';
import OfflineNotice from '../shared/OfflineNotice';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BackgroundGeolocation from "react-native-background-geolocation";
var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');

class Menu extends Component {
    constructor(props) {
        super(props)
        
      }

    onLogout() {
        //refreshToken();
        userdetails.userid = "";
        userdetails.email = "";
        userdetails.firstname = "";
        userdetails.lastname = "";
        userdetails.group = "";
        userdetails.avatar = "";
        userdetails.userid = "";
        userdetails.emptyphoto = "1";
        AsyncStorage.setItem("userid", "");
        AsyncStorage.setItem("email", "");
        AsyncStorage.setItem("firstname", "");
        AsyncStorage.setItem("lastname", "");
        BackgroundGeolocation.stop();
        setTimeout(() => {
            this.props.navigation.navigate("Login");
        }, 1000);

    }    
  


    ready(){
        return (
            <Root>
                <OfflineNotice/>
                <Container style={globalStyle.containerWrapper}>
                    <Header style={globalStyle.header}>
                        <StatusBar backgroundColor="#149279" />
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <MaterialIcons size={30} style={{ color: 'white' }} name='close' />
                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody} >
                            <Title>MENU</Title>
                        </Body>
                        <Right style={globalStyle.headerRight} >
                        </Right>
                       
                    </Header>
                    <ScrollView  contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}>
                        <View style={globalStyle.container}>
                            <List >
                                <ListItem icon button avatar style={globalStyle.listItem} onPress={() => this.props.navigation.navigate('UserProfile')}>
                                        <Left >
                                        <SimpleLineIcons style={{ fontSize: 25, width: 30, color: '#16a085',marginLeft:20 }} name="user" />
                                        </Left>
                                    <Body style={globalStyle.listBody} >
                                        <Text style={{ color: '#454444', fontSize: 18,  }}>PROFILE</Text>
                                        </Body>

                                    <Right style={{ borderBottomWidth:0 }}>
                                        <SimpleLineIcons style={{ fontSize: 20, color: '#16a085', margin:0 }} name='arrow-right' />
                                        </Right>
                                </ListItem>

                                <ListItem icon button avatar style={globalStyle.listItem} onPress={() => this.props.navigation.navigate('GenerateInviteCode')}>
                                    <Left >
                                        <SimpleLineIcons style={{ fontSize: 25, width: 30, color: '#16a085', marginLeft: 20 }} name="user-following" />
                                    </Left>
                                    <Body style={globalStyle.listBody} >
                                        <Text style={{ color: '#454444', fontSize: 18, }}>INVITE MEMBER</Text>
                                    </Body>

                                    <Right style={{ borderBottomWidth: 0 }}>
                                        <SimpleLineIcons style={{ fontSize: 20, color: '#16a085', margin: 0 }} name='arrow-right' />
                                    </Right>
                                </ListItem>

                                <ListItem icon button avatar style={globalStyle.listItem} onPress={() => this.props.navigation.navigate('DisplayMember')}>
                                    <Left >
                                        <SimpleLineIcons style={{ fontSize: 25, width: 30, color: '#16a085', marginLeft: 20 }} name="people" />
                                    </Left>
                                    <Body style={globalStyle.listBody} >
                                        <Text style={{ color: '#454444', fontSize: 18, }}>MEMBER</Text>
                                    </Body>

                                    <Right style={{ borderBottomWidth: 0 }}>
                                        <SimpleLineIcons style={{ fontSize: 20, color: '#16a085', margin: 0 }} name='arrow-right' />
                                    </Right>
                                </ListItem>

                                <ListItem icon button avatar style={globalStyle.listItem} onPress={() => this.props.navigation.navigate('DisplayGroup')}>
                                    <Left >
                                        <SimpleLineIcons style={{ fontSize: 25, width: 30, color: '#16a085', marginLeft: 20 }} name="organization" />
                                    </Left>
                                    <Body style={globalStyle.listBody} >
                                        <Text style={{ color: '#454444', fontSize: 18, }}>GROUP</Text>
                                    </Body>

                                    <Right style={{ borderBottomWidth: 0 }}>
                                        <SimpleLineIcons style={{ fontSize: 20, color: '#16a085', margin: 0 }} name='arrow-right' />
                                    </Right>
                                </ListItem>

                              

                                <ListItem icon button avatar style={globalStyle.listItem} onPress={() => this.props.navigation.navigate('PlaceList')}>
                                    <Left >
                                        <SimpleLineIcons style={{ fontSize: 25, width: 30, color: '#16a085', marginLeft: 20 }} name="location-pin" />
                                    </Left>
                                    <Body style={globalStyle.listBody} >
                                        <Text style={{ color: '#454444', fontSize: 18, }}>PLACES</Text>
                                    </Body>

                                    <Right style={{ borderBottomWidth: 0 }}>
                                        <SimpleLineIcons style={{ fontSize: 20, color: '#16a085', margin: 0 }} name='arrow-right' />
                                    </Right>
                                </ListItem>
                                <ListItem icon button avatar style={globalStyle.listItem} onPress={() => this.props.navigation.navigate("LocationsMember")}>
                                    <Left >
                                        <SimpleLineIcons style={{ fontSize: 25, width: 30, color: '#16a085', marginLeft: 20 }} name="map" />
                                    </Left>
                                    <Body style={globalStyle.listBody} >
                                        <Text style={{ color: '#454444', fontSize: 18, }}>LOCATION HISTORY</Text>
                                    </Body>

                                    <Right style={{ borderBottomWidth: 0 }}>
                                        <SimpleLineIcons style={{ fontSize: 20, color: '#16a085', margin: 0 }} name='arrow-right' />
                                    </Right>
                                </ListItem>

                             
                                <ListItem icon button avatar style={globalStyle.listItem} onPress={() => this.props.navigation.navigate('HomeSettings')}>
                                    <Left >
                                        <SimpleLineIcons style={{ fontSize: 25, width: 30, color: '#16a085', marginLeft: 20 }} name="settings" />
                                    </Left>
                                    <Body style={globalStyle.listBody} >
                                        <Text style={{ color: '#454444', fontSize: 18, }}>SETTINGS</Text>
                                    </Body>

                                    <Right style={{ borderBottomWidth: 0 }}>
                                        <SimpleLineIcons style={{ fontSize: 20, color: '#16a085', margin: 0 }} name='arrow-right' />
                                    </Right>
                                </ListItem>
                                <ListItem icon button avatar style={globalStyle.listItem} onPress={() => Linking.openURL('http://mygpsbuddy.findplace2stay.com/aboutus')}>
                                    <Left >
                                        <SimpleLineIcons style={{ fontSize: 25, width: 30, color: '#16a085', marginLeft: 20 }} name="info" />
                                    </Left>
                                    <Body style={globalStyle.listBody} >
                                        <Text style={{ color: '#454444', fontSize: 18, }}>ABOUT</Text>
                                    </Body>

                                    <Right style={{ borderBottomWidth: 0 }}>
                                    </Right>
                                </ListItem>
                                   

              
                                <ListItem icon button avatar style={globalStyle.listItem} onPress={() => Linking.openURL('http://mygpsbuddy.findplace2stay.com/faqs')}>
                                    <Left >
                                        <SimpleLineIcons style={{ fontSize: 25, width: 30, color: '#16a085', marginLeft: 20 }} name="question" />
                                    </Left>
                                    <Body style={globalStyle.listBody} >
                                        <Text style={{ color: '#454444', fontSize: 18, }}>FAQs</Text>
                                    </Body>

                                    <Right style={{ borderBottomWidth: 0 }}>
                                    </Right>
                                </ListItem>
                                <ListItem icon button avatar style={globalStyle.listItem} onPress={() => this.onLogout()}>
                                    <Left >
                                        <SimpleLineIcons style={{ fontSize: 25, width: 30, color: '#16a085', marginLeft: 20 }} name="logout" />
                                    </Left>
                                    <Body style={globalStyle.listBody} >
                                        <Text style={{ color: '#454444', fontSize: 18, }}>LOGOUT</Text>
                                    </Body>

                                </ListItem>

                                </List>

                    </View>
                </ScrollView>
                </Container>
        
                
        </Root>
        )
    }
    

    render() {
            return this.ready();
    }
}


  
  
export default Menu;