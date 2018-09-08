
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch } from 'native-base';
import { connect } from 'react-redux';
import OfflineNotice  from '../shared/OfflineNotice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { displayGroup  } from '../../redux/actions/groupActions' ;

var globalStyle = require('../../assets/style/GlobalStyle');



class DisplayHomeGroup extends Component {
    constructor(props) {
        super(props)
      }

      
    componentWillMount() {
        this.props.displayGroup();
    }


    render() {
        const { navigate } = this.props.navigation;

        

        const groups =this.props.groups.map(group=>(
            <ListItem key={group.id} avatar onPress={() =>navigate('EditGroup',{id:group.id,groupname:group.groupname})}>{group.groupname}>
            <Left>
                <View style={globalStyle.avatarcontainer}> 
                <Thumbnail  style={globalStyle.avatar} source={{uri: group.avatar}} />
                </View>
              </Left>
              <Body>
                <Text style={globalStyle.heading1}>{group.groupname}</Text>
              </Body>
              
          </ListItem>


           
          ));
        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                <OfflineNotice/>
                    <Header style={globalStyle.header}>
                    <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={()=> {this.props.navigation.goBack()}} >
                                <Icon size={30} name='arrow-back' />
                            </Button> 
                        </Left>
                        <Body>
                            <Title>Switch Group</Title>
                        </Body>
                        
                    </Header>
                    <Content>
                        <List>
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
  
  
DisplayHomeGroup=connect(mapStateToProps,{displayGroup})(DisplayHomeGroup);
  
export default DisplayHomeGroup;