
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch, Separator } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { displayGroup  } from '../../redux/actions/groupActions' ;
import OfflineNotice  from '../shared/OfflineNotice';
var globalStyle = require('../../assets/style/GlobalStyle');



class MembersGroup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            groupname:this.props.navigation.state.params.groupname,
            groupid:this.props.navigation.state.params.id
        };

      }

      
    componentWillMount() {
        this.props.displayGroup();
    }


    render() {
        const { navigate } = this.props.navigation;


        const groups =this.props.groups.map(group=>(
            <ListItem key={group.id} >
            <Left><Text>{group.groupname}</Text></Left>
          </ListItem>
          ));
        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                <OfflineNotice/>
                    <Header style={globalStyle.header}>
                        <Left style={globalStyle.headerMenu} >
                            <Button transparent onPress={()=> {this.props.navigation.goBack()}}>
                                <Icon size={30} name='arrow-back' />
                            </Button> 
                        </Left>
                        <Body>
                            <Title>Members</Title>
                        </Body>
                        <Right  >
                            <Button transparent onPress={() => navigate('EditGroup',{id:this.state.id,groupname:this.state.groupname})}>
                                <MaterialIcons size={22} style={globalStyle.icon} name='edit' />
                            </Button> 
                            
                        </Right>
                    </Header>
                    <Content >
                        <List>
                            <Separator bordered>
                                <Text>{this.state.groupname}</Text>
                            </Separator>
                            {groups}
                        </List>
                    </Content>
                </Container>
            </Root>
        );
  }
}




const mapStateToProps = state => ({
    groups: state.fetchGroup.items,
  })
  
  
MembersGroup=connect(mapStateToProps,{displayGroup})(MembersGroup);
  
export default MembersGroup;