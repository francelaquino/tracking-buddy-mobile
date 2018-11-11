
import React, { Component } from 'react';
import {  StatusBar, Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid, Image, Alert,RefreshControl, FlatList } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,CheckBox, Thumbnail, CardItem, Card } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { connect } from 'react-redux';
import { displayGroupMember, addGroupMember, displayHomeMember, removeGroupMember } from '../../redux/actions/memberActions';
import { displayGroup } from '../../redux/actions/groupActions';
import { LeftHome } from '../shared/LeftHome';
import OfflineNotice  from '../shared/OfflineNotice';
import Loading  from '../shared/Loading';
var userdetails = require('../shared/userDetails');
var globalStyle = require('../../assets/style/GlobalStyle');



class AddMember extends Component {
    constructor(props) {
        super(props)
        this.state={
            refresh: true,
            loading:true,
        }
      }

    
    componentWillMount() {
        
        this.initialize();
    }
   
    addSelectedMember(index){
        let mem = [...this.props.members];
        if(mem[index].ismember==0){
            this.props.members[index].ismember=1;
            this.props.addGroupMember(this.props.navigation.state.params.group.id,mem[index]).then(res=>{
                this.setState({ 
                    refresh: !this.state.refresh
                })
                this.props.displayGroup();
            })
        }else{
            this.props.members[index].ismember=0;
            this.props.removeGroupMember(this.props.navigation.state.params.group.id,mem[index]).then(res=>{
                this.setState({ 
                    refresh: !this.state.refresh
                })
                this.props.displayGroup();
            })

        }
      


    }

    
    
    initialize() {
        this.props.displayGroupMember(this.props.navigation.state.params.group.id).then(res => {
            if (res == true) {
                this.setState({ loading:false })
            }
        })
       
    }


   
    loading(){
        return (
          <Loading/>
        )
    }
    
    renderMember(){
        console.log(this.props.members)
        const data=this.props.members;
        return (
            <FlatList
                extraData={this.state.refresh}
                style={{flex:1}}
                keyExtractor={item => item.uid}
                data={data}
                renderItem={({ item,index }) => (
                    <ListItem key={item.uid} avatar style={globalStyle.listItem} >
                          <Left style={globalStyle.listLeft}>
                        <View style={globalStyle.listAvatarContainer} >
                                {item.emptyphoto === "1" ? <Text style={{fontSize:23,color:'#16a085'}}>{item.firstletter}</Text> :
                                    <Thumbnail style={globalStyle.listAvatar} source={{ uri: item.avatar }} />
                                }


                             
                            </View>


                        
                    </Left>
                    <Body style={globalStyle.listBody} >
                            <Text style={globalStyle.heading1}>{item.firstname}</Text>
                        </Body>
                        <Right style={globalStyle.listRight}>
                        <TouchableOpacity style={{position:'absolute',top:10,right:1,width:60,height:30}} onPress={() => this.addSelectedMember(index)}>
                                { item.ismember ===1 &&
                                <Feather  style={{color:'#009da3',position:'absolute',top:1,right:1}} size={25} name="check-circle" />
                                }
                                { item.ismember ===0 &&
                                <Feather  style={{color:'#009da3',position:'absolute',top:1,right:1}} size={25} name="circle" />
                                }
                                </TouchableOpacity>
                            
                    </Right>
                  </ListItem>




                        ) }
                />)
    }
    
    ready(){
       

        return (
           
                    
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                        <Content padder>
                    <View style={globalStyle.container}>
                        <List>
                            {this.renderMember()}
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
                        <StatusBar backgroundColor="#149279" />
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />

                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody}>
                            <Title>{this.props.navigation.state.params.group.groupname}</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}>
                            <Button transparent onPress={() => this.props.navigation.navigate('EditGroup', { group: this.props.navigation.state.params.group })}>
                                <MaterialIcons size={28} style={{ color: 'white' }} name='mode-edit' />
                            </Button>

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
    members: state.fetchMember.members,
    isLoading:state.fetchMember.isLoading,
  })
  
  
AddMember = connect(mapStateToProps, { displayGroupMember, displayHomeMember, addGroupMember, removeGroupMember, displayGroup})(AddMember);
  
  
  
export default AddMember;