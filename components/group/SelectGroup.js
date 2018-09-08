
import React, { Component } from 'react';
import { TouchableOpacity,Modal, Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image  } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch,Thumbnail, Card,CardItem } from 'native-base';
import { connect } from 'react-redux';
import { displayGroup  } from '../../redux/actions/groupActions' ;
import { displayHomeMember  } from '../../redux/actions/memberActions' ;
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loading  from '../shared/Loading';
var userdetails = require('../shared/userDetails');
var globalStyle = require('../../assets/style/GlobalStyle');



class SelectGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading:true,
        };
        


    
    }
   
    componentWillMount() {
        this.initialize();
    }
        
    initialize() {
        this.props.displayGroup().then((res) => {
            if (res == true) {
                this.setState({
                    loading: false,
                })

            }
        });
    }




    changeGroup(groupid,groupname){
        userdetails.group=groupid;
        this.props.navigation.state.params.changeGroup(groupname);
        this.props.navigation.goBack();
    }

    allMembers(){
        userdetails.group="";
        this.props.navigation.state.params.changeGroup("");
        this.props.navigation.goBack();
    }

    

    loading(){
        return (
          <Loading/>
        )
    }
    ready(){
        const { navigate } = this.props.navigation;
        const groups =this.props.groups.map(group=>(
            <ListItem key={group.id}  avatar style={globalStyle.listItem} onPress={()=>this.changeGroup(group.id,group.groupname)}>
                <Left style={globalStyle.listLeft}>
                    <View style={globalStyle.listAvatarContainer} >
                        {group.emptyphoto === 1 ? <Ionicons size={46} style={{ color: '#2c3e50' }} name="ios-people" /> :
                            <Thumbnail style={globalStyle.listAvatar} source={{ uri: group.avatar }} />
                        }

                    </View>
                </Left>
                <Body style={globalStyle.listBody} >
                    <Text style={globalStyle.listHeading}>{group.groupname}</Text>
                </Body>
            </ListItem>

           
          ));

         
        return(
                    
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                <Content padder>
                    <View style={globalStyle.container}>
                    
                        <List>
                        
                            {groups}
                        </List>

                         
                            </View>
                             </Content>
                    </ScrollView>
                   
        )
    }

    render() {
       


        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                    <Header style={globalStyle.header}>
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />
                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody}>
                            <Title>Switch Group</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}>
                        </Right>
                    </Header>
                    {
                        this.state.loading ? this.loading() :
                            this.ready()
                    }

                </Container>
            </Root>
        )
    }
   
}
  
  

const mapStateToProps = state => ({
    groups: state.fetchGroup.groups,
    isLoading: state.fetchGroup.isLoadingGroup,
  })
  
  SelectGroup=connect(mapStateToProps,{displayGroup,displayHomeMember})(SelectGroup);
  
export default SelectGroup;

