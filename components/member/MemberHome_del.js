
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { Content,Root, Container, Header,Tabs, Tab, TabHeading, Body, Title, Item, Input, Label, Button, Icon, Left, Right } from 'native-base';
import InfoMember from '../member/InfoMember';
import LocationPlaces from '../places/LocationPlaces';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { TabNavigator } from 'react-navigation';
import OfflineNotice  from '../shared/OfflineNotice';
var globalStyle = require('../../assets/style/GlobalStyle');


class MemberHome extends Component {
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
                            <Title>{this.props.navigation.state.params.firstname}</Title>
                        </Body>
                       
                    </Header>
                            <Tabs tabBarPosition="top" tabBarUnderlineStyle={{borderBottomWidth:2,borderBottomColor:'#16a085'}} >
                            <Tab  heading={<TabHeading style={{backgroundColor: 'white'}}>
                                <Text style={{color: '#16a085',fontSize:16}}>Profile</Text>
                                </TabHeading>}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <InfoMember navigate={this.props.navigation} memberuid={this.props.navigation.state.params.uid} memberfirstname={this.props.navigation.state.params.firstname}/>
                                </ScrollView>
                                
                                
                            </Tab>
                            <Tab  heading={<TabHeading style={{backgroundColor: 'white'}}>
                                <Text style={{color: '#16a085',fontSize:16}}>Locations</Text>
                                </TabHeading>}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                <LocationPlaces memberuid={this.props.navigation.state.params.uid} navigate={this.props.navigation.navigate} />
                                </ScrollView>
                            </Tab>
                            </Tabs>
                            
                </Container>
            </Root>
           
        )
    }
    
}




  
  
export default MemberHome;
