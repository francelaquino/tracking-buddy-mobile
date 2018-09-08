
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid,  } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Right, Content} from 'native-base';
import Loading from '../shared/Loading';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../shared/Loader';
import OfflineNotice  from '../shared/OfflineNotice';
//import firebase from 'react-native-firebase';
var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../shared/userDetails');


class ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            currentpassword:'',
            newpassword:'',
            retypepassword:'',
        };
      }

    componentWillMount() {
    }
            
  
    onSubmit(){
        if(this.state.currentpassword=="" ){
            ToastAndroid.showWithGravityAndOffset("Please enter current password",ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 50);
            return false;
        }
        if(this.state.newpassword=="" ){
            ToastAndroid.showWithGravityAndOffset("Please enter new password",ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 50);
            return false;
        }
        if(this.state.newpassword!=this.state.retypepassword ){
            ToastAndroid.showWithGravityAndOffset("Password mismatch",ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 50);
            return false;
        }
        
        

        let self = this;
        firebase.database().ref(".info/connected").on("value", function (snap) {
            if (snap.val() === true) {
                this.setState({ loading: true })
                let user = firebase.auth().currentUser;
                let credentails = firebase.auth.EmailAuthProvider.credential(userdetails.email, this.state.currentpassword);
                user.reauthenticateAndRetrieveDataWithCredential(credentails).then(function () {
                    user.updatePassword(self.state.newpassword).then(function () {
                        self.setState({ loading: false })
                        self.setState({
                            currentpassword: '',
                            newpassword: '',
                            retypepassword: ''
                        })
                        ToastAndroid.showWithGravityAndOffset("Password successfully changed", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }).catch(function (err) {
                        if (err.code == "auth/weak-password") {
                            ToastAndroid.showWithGravityAndOffset("The given password is invalid. Password should be at least 6 characters", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        } else {
                            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        }
                        self.setState({ loading: false })
                    });
                }).catch(function (err) {
                    ToastAndroid.showWithGravityAndOffset("The current password is invalid", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    self.setState({ loading: false })
                });
            } else {
                ToastAndroid.showWithGravityAndOffset("Network connection error", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            }
        });


        
    }


   
    loading(){
        return (
          <Loading/>
        )
    }
    ready(){
        return (
            <Root>
                <Loader loading={this.state.loading} />
                <OfflineNotice/>
                <Container style={globalStyle.containerWrapper}>
               
                    <Header style={globalStyle.header}>
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />
                            </Button>
                        </Left>
                        <Body style={[globalStyle.headerBody, {flex:3}]} >
                            <Title>CHANGE PASSWORD</Title>
                        </Body>
                        <Right  >
                        </Right>
                    </Header>
                    <Content padder>
                    <ScrollView  contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}>
                    <View style={globalStyle.container}>

                                <Item stackedLabel>
                                    <Label style={globalStyle.label} >Current Password</Label>
                                    <Input style={globalStyle.textinput} value={this.state.currentpassword} maxLength={50} secureTextEntry
                                        onChangeText={currentpassword => this.setState({ currentpassword })} />
                                </Item>
                                <Item stackedLabel>
                                    <Label style={globalStyle.label} >New Password</Label>
                                    <Input style={globalStyle.textinput} value={this.state.newpassword} maxLength={50} secureTextEntry
                                        onChangeText={newpassword => this.setState({ newpassword })} />
                                </Item>
                                <Item stackedLabel>
                                    <Label style={globalStyle.label} >Re-type Password</Label>
                                    <Input style={globalStyle.textinput} value={this.state.retypepassword} maxLength={50} secureTextEntry
                                        onChangeText={retypepassword => this.setState({ retypepassword })} />
                                </Item>

                        
                        

                        
                       

                        <View style={{justifyContent: 'center',alignItems: 'center'}}>
                        
                            <Button 
                                onPress={()=>this.onSubmit()}
                                full  style={globalStyle.secondaryButton}>
                                <Text style={{color:'white'}}>Submit</Text>
                            </Button>
                            
                        </View>

                    </View>
                </ScrollView>
                </Content>
                </Container>
        
                
        </Root>
        )
    }
    

    render() {
            return this.ready();
    }
}


  
  
export default ChangePassword;