
import React, { Component } from 'react';
import {  StatusBar, Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid,  } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Right, Content} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../shared/Loader';
import { connect } from 'react-redux';
import OfflineNotice  from '../shared/OfflineNotice';
import { changePassword } from '../../redux/actions/userActions' ;
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
        
        
        let user = {
            currentpassword: this.state.currentpassword,
            newpassword: this.state.newpassword,
            email: userdetails.email,
            userid:userdetails.userid,
        }
        this.setState({ loading: true })
        this.props.changePassword(user).then(async (res) => {
                this.setState({ loading: false, currentpassword: '', newpassword: '',retypepassword:'' })
        });
       
        


        
    }


   
    ready(){
        return (
            <Root>
                <Loader loading={this.state.loading} />
                <OfflineNotice/>
                <Container style={globalStyle.containerWrapper}>
               
                    <Header style={globalStyle.header}>
                        <StatusBar backgroundColor="#149279" />
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

                        <Label style={globalStyle.label} >Enter current password</Label>
                              <Item regular style={globalStyle.roundtextinput}>
                              <Input  
							name="currentpassword" autoCorrect={false} maxLength = {50}
                                      value={this.state.currentpassword}
                                      autoCapitalize="none" secureTextEntry
							onChangeText={currentpassword=>this.setState({currentpassword})}/>
						</Item>

                         <Label style={globalStyle.label} >Enter new password</Label>
                              <Item regular style={globalStyle.roundtextinput}>
                              <Input 
							name="newpassword" autoCorrect={false} maxLength = {50}
                                      value={this.state.newpassword}
                                      autoCapitalize="none" secureTextEntry
							onChangeText={newpassword=>this.setState({newpassword})}/>
						</Item>

                         <Label style={globalStyle.label} >Re-type new password</Label>
                              <Item regular style={globalStyle.roundtextinput}>
                              <Input 
							name="retypepassword" autoCorrect={false} maxLength = {50}
                                      value={this.state.retypepassword}
                                      autoCapitalize="none" secureTextEntry
							onChangeText={retypepassword=>this.setState({retypepassword})}/>
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


  
  
const mapStateToProps = state => ({
    
})



ChangePassword = connect(mapStateToProps, { changePassword})(ChangePassword);

export default ChangePassword;