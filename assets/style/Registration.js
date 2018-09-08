'use strict';
import { theme } from '../style/Theme'
import { PixelRatio} from 'react-native';
var React = require('react-native');

var { StyleSheet} = React;
module.exports = StyleSheet.create({
    containerWrapper: {
        backgroundColor:'#f5f8f9',
    },
    container: {
        backgroundColor:'#f5f8f9',
        flex: 1,
        padding:10,
        alignSelf: "center",
        flexDirection:'column',
        width:'95%',
        marginTop:30,
    },
    header: {
        marginTop:0,
        paddingTop:25,
        height:135,
        backgroundColor: theme.primaryColor,
    },
    logoContainer:{
        alignItems: 'center',
        marginBottom:60
    },
    logo:{
        height:140,
    },
    regularitem:{
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        height: 50,
        backgroundColor:'white',
        marginBottom: 5,
        borderRadius: 12,
    },
    item: {
        borderColor:'transparent',
        backgroundColor:'transparent',
    },
    subitem: {
        borderColor:'transparent',
        backgroundColor:'transparent',
        alignSelf: "center",
    },
    stackedlabel:{
        color:theme.lightColor,
        paddingTop:0,
        fontSize:15,
    },
    textinput:{
        flex: 1,
        padding:5,
        height: 50,
        fontSize: 15,
       
        
        
    },
    countrycode:{
        paddingTop:0,
        fontSize:15,
        color:'gray',
        alignSelf: "center",
    },
    registrationbutton:{
        backgroundColor: theme.primaryButtonColor,
        borderRadius: 15,
    },
    haveaccount:{
        fontSize:16,
        color:'gray',
        marginTop: 10,
        marginBottom: 20
    },
    loginButton:{
        color:theme.primaryButtonColor,
        fontSize:16,
        marginTop: 20,
        borderRadius: 12,
    },
    error:{
        borderColor:'red'
    },
    inputicon:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    show:{
        opacity:100,
    },
    iconError:{
        position:'absolute',
        right: 0,
        opacity:0,
    },
    avatarContainer:{
        backgroundColor:'#16a085',
        alignItems: 'center',
        marginBottom:10,
        borderRadius: 40,
        width: 80,
        height: 80,
        padding:2,
        alignSelf: "center",
        flexDirection:'column',
    },

      avatar: {
        borderRadius: 38,
        width: 76,
        height: 76,
      }
    
  

});


