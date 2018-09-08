
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { Content,Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Right,Tabs, Tab, TabHeading } from 'native-base';
import EditGroup from '../group/EditGroup';
import AddMember from '../group/AddMember';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OfflineNotice  from '../shared/OfflineNotice';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
var globalStyle = require('../../assets/style/GlobalStyle');

class GroupHome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            groupname:'',
            avatarsource:'',
            avatar:'',
            groupid:''
        };
	  }
    
      componentWillMount() {
        this.initialize();
    }
            
    initialize(){
        console.log(this.props.navigation.state.params)
        this.setState({
            avatarsource:this.props.navigation.state.params.avatar,
            groupname:this.props.navigation.state.params.groupname,
            groupid: this.props.navigation.state.params.id,
            emptyphoto: this.props.navigation.state.params.emptyphoto,
        })
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
                            <Title>{this.props.navigation.state.params.groupname}</Title>
                        </Body>
                       
                    </Header>
                            <Tabs tabBarPosition="top" tabBarUnderlineStyle={{borderBottomWidth:2,borderBottomColor:'#16a085'}} >
                            <Tab  heading={<TabHeading style={{backgroundColor: 'white'}}>
                                <Text style={{color: '#16a085',fontSize:16}}>Edit Group</Text>
                                </TabHeading>}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <EditGroup emptyphoto={this.state.emptyphoto} avatarsource={this.state.avatarsource} groupname={this.state.groupname} groupid={this.state.groupid} />
                                </ScrollView>
                                
                                
                            </Tab>
                            <Tab  heading={<TabHeading style={{backgroundColor: 'white'}}>
                                <Text style={{color: '#16a085',fontSize:16}}>Members</Text>
                                </TabHeading>}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <AddMember  groupname={this.state.groupname} groupid={this.state.groupid}/>

                                </ScrollView>
                            </Tab>
                            </Tabs>
                            
                </Container>
            </Root>
           
        )
    }
    
}

export default GroupHome;
