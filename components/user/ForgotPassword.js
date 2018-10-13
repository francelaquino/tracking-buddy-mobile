
import React, { Component } from 'react';
import { StatusBar, NetInfo, Platform, StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, ToastAndroid, NavigationActions } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Right, Content } from 'native-base';
import firebase from 'react-native-firebase';
import Loader from '../shared/Loader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OfflineNotice  from '../shared/OfflineNotice';
var registrationStyle = require('../../assets/style/Registration');
var globalStyle = require('../../assets/style/GlobalStyle');

class ForgotPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading:false,
            email: '',
            
        };
       

      }
      
 

      onSubmit (){
        
        let self=this;
        if(this.state.email=="" ){
            ToastAndroid.showWithGravityAndOffset("Enter email address",ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
            return false;
        }
          firebase.database().ref(".info/connected").on("value", function (snap) {
              if (snap.key === "connected") {
                self.setState({ loading: true })
                  firebase.auth().sendPasswordResetEmail(self.state.email).then((res) => {
                      self.setState({ loading: false, email: '' });
                      ToastAndroid.showWithGravityAndOffset("A message has been sent to your email with instructions to reset your password", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                  }).catch(function (err) {
                      self.setState({ loading: false });
                      if (err.code === 'auth/user-not-found') {
                          ToastAndroid.showWithGravityAndOffset("Unrecognized email address", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                      } else {

                      }

                  });
              } else {
                  ToastAndroid.showWithGravityAndOffset("Network connection error", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
              }
          })

        

      
    }
    render() {

        
    const { navigate } = this.props.navigation;
    return (
        <Root>
            <Container style={registrationStyle.containerWrapper}>
        	   
          	<Loader loading={this.state.loading} />
                <OfflineNotice />
                <Header style={globalStyle.header}>
                    <StatusBar backgroundColor="#149279" />
                    <Left style={globalStyle.headerLeft} >
                        <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                            <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />

                        </Button>
                    </Left>
                    <Body style={globalStyle.headerBody}>
                        <Title style={globalStyle.headerTitle}>FORGOT PASSWORD</Title>
                    </Body>
                    <Right style={globalStyle.headerRight} >



                    </Right>

                </Header>
                <Content padder>
            <ScrollView  contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}>
                    <View style={registrationStyle.container}>
                        <View style={registrationStyle.logoContainer}>
                        <Image  style={registrationStyle.logo} resizeMode='contain'  source={require('../../images/logo.png')} />
                        <Text style={{fontSize:22,color:'#303131'}}>My GPS Buddy</Text>
                        
                            </View>

                           

                            <Item stackedLabel>
                                <Label style={globalStyle.label} >Email Address</Label>
                                <Input style={registrationStyle.textinput} 
                                    autoCapitalize="none"
                                name="email" autoCorrect={false}
                            value={this.state.email}  maxLength = {50}
                            onChangeText={email=>this.setState({email})}/>
                        </Item>
                       

                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop:20 }}>
                            <Button 
                                onPress={()=>this.onSubmit()}
                                full rounded style={registrationStyle.registrationbutton}>
                                <Text style={{color:'white'}}>Retrieve Password</Text>
                            </Button>
                            
                            <TouchableOpacity  underlayColor={'transparent'}  onPress={() =>navigate('Login')}>
                            <Text style={registrationStyle.haveaccount}>Already a member? <Text style={registrationStyle.loginButton}>Login</Text></Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    </ScrollView>
                </Content>
            </Container>
      </Root>
    );
  }
}


  
export default ForgotPassword;
