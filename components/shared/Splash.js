import React, { Component } from 'react';
import { AsyncStorage, View, Text, NetInfo, Dimensions, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import { displayHomeMember } from '../../redux/actions/memberActions';
import { saveLocation } from '../../redux/actions/locationActions';
const { width, height } = Dimensions.get('window');
var userdetails = require('../shared/userDetails');


class Splash extends Component {

    async componentDidMount() {
        let self = this;
        let userid = await AsyncStorage.getItem("userid");
        let email = await AsyncStorage.getItem("email");
        let firstname = await AsyncStorage.getItem("firstname");
        let lastname = await AsyncStorage.getItem("lastname");
        let avatar = await AsyncStorage.getItem("avatar");
        let emptyphoto = await AsyncStorage.getItem("emptyphoto");
        
        

        await setTimeout(async () => {
            if (userid === "" || userid === null) {
                self.props.navigation.navigate('Login');
            } else {
                userdetails.emptyphoto = emptyphoto;
                userdetails.userid = userid;
                userdetails.email = email;
                userdetails.avatar = avatar;
                userdetails.firstname = firstname;
                userdetails.lastname = lastname;

                await self.props.saveLocation();
                await setTimeout(() => {
                    self.props.displayHomeMember();
                    self.props.navigation.navigate('Home');
                }, 1000);


            }

        }, 3000);
    }

    render() {
            return (
                <View style={{  zIndex: 99999, height: height+30, backgroundColor:'#16a085' }} >
                 <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height:100,
                }}>
                    <Text style={{ fontSize: 25, color: 'white',position:'absolute',bottom:10 }}>My GPS Buddy</Text>

                </View>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image style={{ height: 200, marginTop: -150,marginBottom:50 }} resizeMode='contain' source={require('../../images/logo_splash.png')} />
                    <Text style={{ fontSize: 18, color: 'white',fontStyle: 'italic'}}>Keeping your Family and Friends</Text>
                    <Text style={{ fontSize: 18, color: 'white',fontStyle: 'italic' }}>Safer and Closer.</Text>

                </View>
               
                    
                </View >
            )
    }
}


const mapStateToProps = state => ({

})



Splash = connect(mapStateToProps, { displayHomeMember, saveLocation })(Splash);

export default Splash;

