
import React, { Component } from 'react';
import {  Linking,StatusBar,BackHandler, AsyncStorage, NetInfo, Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, Image,ToastAndroid, NavigationActions  } from 'react-native';
import { Separator, ListItem,CheckBox, Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon } from 'native-base';
import Loader from '../shared/Loader';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
var registrationStyle = require('../../assets/style/Registration');
var globalStyle = require('../../assets/style/GlobalStyle');

var policy=false;
class Terms extends Component {
    constructor(props) {
        super(props)
        this.state = {
            policy:false,
            terms:false,
            email: '',
            password:'',
            
        };
       

      }
      
  
      componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
      }
      componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
      }

      handleBackButtonClick() {
        BackHandler.exitApp();
        return true;
      }
   
      
    render() {
        
    return (
        
        <Root>
            <Container style={registrationStyle.containerWrapper}>
                <Header style={globalStyle.header}>
                      <StatusBar backgroundColor="#16a085" />
                      
                      <Body style={globalStyle.headerBody}>
                          <Title style={globalStyle.headerTitle}>MY GPS BUDDY</Title>
                      </Body>
                      

                  </Header>
                
            <ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}>
                    <View style={registrationStyle.container}>
                    <Text style={{color:'#16a085',fontSize:20}}>Terms and Conditions</Text>
                    <Text style={{color:'#34495e',lineHeight:25, justifyContent:'space-evenly',borderBottomColor:'#ecf0f1',borderBottomWidth:1,paddingBottom:10,marginBottom:20,marginTop:20}}>Tap the link below and read them carefully. By checking the boxes, you acknowledge that you have read and agree to the following terms:</Text>
                    <ListItem style={{borderBottomWidth:0}}>
                        <CheckBox checked={this.state.terms} onPress={()=>this.setState({ terms: !this.state.terms}) }  color="#16a085"/>
                        <Body>
                        <TouchableOpacity onPress={() => Linking.openURL('http://mygpsbuddy.findplace2stay.com/termsandconditions')}>
                        <Text style={{marginLeft:10,fontSize:16,textDecorationLine: 'underline',color:'#3498db'}}>Terms and Conditions</Text>
                        </TouchableOpacity>
                        </Body>
                    </ListItem>
                    <ListItem style={{borderBottomWidth:0}}>
                        <CheckBox checked={this.state.policy} onPress={()=>this.setState({ policy: !this.state.policy}) }  color="#16a085"/>
                        <Body>
                        <TouchableOpacity onPress={() => Linking.openURL('http://mygpsbuddy.findplace2stay.com/privacypolicy')}>
                        <Text style={{marginLeft:10,fontSize:16,textDecorationLine: 'underline',color:'#3498db'}}>Privacy Policy</Text>
                        </TouchableOpacity>
                        </Body>
                    </ListItem>
                    </View>
                    <View style={{position:'absolute',backgroundColor:'#16a085',bottom:0,height:65,width:'100%'}}>
                    <TouchableOpacity style={{position:'absolute',bottom:0,height:65,padding:10,left:15,width:90}} onPress={() => this.handleBackButtonClick()}>
                    <Text style={{position:'absolute',color:'white',fontSize:16,bottom:0,height:65,left:0,textAlignVertical:'center'}}  >DECLINE</Text>
                    </TouchableOpacity>
                    { (this.state.policy==true && this.state.terms==true) ?
                        <TouchableOpacity  onPress={() =>  this.props.navigation.navigate('Login')} style={{position:'absolute',bottom:0,height:65,padding:10,right:15,width:100}} >
                        <Text  style={{position:'absolute',color:'white',fontSize:16,bottom:0,height:65,right:0,textAlignVertical:'center'}}>AGREE <SimpleLineIcons size={15} style={{position:'absolute'}} name='arrow-right' /></Text>  
                        </TouchableOpacity> :
                        <View   style={{position:'absolute',bottom:0,height:65,padding:10,right:15,width:100}} >
                        <Text  style={{position:'absolute',color:'silver',fontSize:16,bottom:0,height:65,right:0,textAlignVertical:'center'}}>AGREE <SimpleLineIcons size={15} style={{position:'absolute'}} name='arrow-right' /></Text>  
                        </View> 
                     
                     }
                    </View>
                   
                </ScrollView>
            </Container>
      </Root>
    );
  }
}


  
  
  
  
  
export default Terms;
