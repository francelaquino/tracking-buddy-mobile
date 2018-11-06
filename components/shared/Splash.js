import React, { Component } from 'react';
import { AsyncStorage, View, Text, NetInfo, Dimensions, StyleSheet, Image,ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { displayHomeMember } from '../../redux/actions/memberActions';
import { saveLocation } from '../../redux/actions/locationActions';
const { width, height } = Dimensions.get('window');
var userdetails = require('../shared/userDetails');


class Splash extends Component {

    async componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
            },
            (err) => {
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
        
        let self = this;
        let userid = await AsyncStorage.getItem("userid");
        let email = await AsyncStorage.getItem("email");
        let firstname = await AsyncStorage.getItem("firstname");
        let lastname = await AsyncStorage.getItem("lastname");
        let avatar = await AsyncStorage.getItem("avatar");
        let emptyphoto = await AsyncStorage.getItem("emptyphoto");
        let agree=await AsyncStorage.getItem("agree");
        let firstletter=await AsyncStorage.getItem("firstletter");
        

        await setTimeout(async () => {
            if(agree=="yes"){
            if (userid === "" || userid === null) {
                self.props.navigation.navigate('Login');
            } else {
                userdetails.emptyphoto = emptyphoto;
                userdetails.userid = userid;
                userdetails.email = email;
                userdetails.avatar = avatar;
                userdetails.firstname = firstname;
                userdetails.lastname = lastname;
                userdetails.firstletter = firstletter;
                self.props.navigation.navigate('Home');
                /*await self.props.saveLocation();
                await setTimeout(() => {
                    self.props.displayHomeMember();
                  
                }, 1000);*/


            }
         }else{
            self.props.navigation.navigate('Terms');
         }

        }, 500);
    }

    render() {
            return (
                <View style={{  zIndex: 99999, height: height+30, backgroundColor:'#16a085' }} >
                 
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                  <Image style={{ height: 200, marginTop: -150,marginBottom:50 }} resizeMode='contain' source={require('../../images/logo_splash.png')} />
                  <ActivityIndicator color="white" size="large"
                            animating={this.props.loading} />
                        <Text style={{ color: 'white' }}>Loading...</Text>


                </View>
               
                    
                </View >
            )
    }
}


const mapStateToProps = state => ({

})



Splash = connect(mapStateToProps, { displayHomeMember, saveLocation })(Splash);

export default Splash;

