'use strict';
import { theme } from '../style/Theme'
var React = require('react-native');
import { Dimensions} from 'react-native';

var { StyleSheet} = React;
module.exports = StyleSheet.create({
    containerWrapper: {
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: theme.primaryColor,

    },
    headerMenu: {
        width: 40,
        flex: 0,
    },
    headerLeft: {
        flex: 1,
        width: 40,
    },
    headerBody: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRight: {
        flex: 1,
    },
    headerRightIcon: {
        width: 40,
        color: 'white',
        flex: 0,
    },
    headerRightText: {
        color: 'white',
        fontSize: 20,
    },
    headerLeftMenuIcon: {
        color: 'white',
    },
    headerTitle: {
        color: 'white',
        fontSize: 17,
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
        alignSelf: "center",
        flexDirection: 'column',
        width: '100%',
    },
    regularitem: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 15,
        borderTopWidth: 1,
        height: 50,
        backgroundColor: 'white',
        marginBottom: 5,
    },
    item: {
        borderColor: 'transparent',
        backgroundColor: 'transparent',
    },
    inputicon: {
        backgroundColor: 'transparent',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: theme.primaryButtonColor,
        marginTop: 10,
        marginBottom: 10,
        width: '100%',
        alignSelf: "center",
        borderRadius: 5,
        elevation:0,
    },
    calloutButton:{
        marginBottom: 5,
        width: '50%',
        height:35,
        alignSelf: "center",
        backgroundColor: '#009ad6',
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: 'gray',
        marginBottom: 10,
        width: '100%',
        alignSelf: "center",
        borderRadius: 15,
    },
    secondaryButtonDisabled: {
        backgroundColor: theme.lightColor,
        marginBottom: 10,
        width: '100%',
        alignSelf: "center",
        borderRadius: 15,
    },
    deleteButton: {
        backgroundColor: theme.deleteColor,
        marginBottom: 10,
        width: '100%',
        alignSelf: "center",
        borderRadius: 15,
    },

    textinputreadonly: {
        flex: 1,
        padding: 5,
        height: 50,
        fontSize: 15,
        color: 'gray',
        textAlign: 'left',
    },
    textinput: {
        flex: 1,
        padding: 5,
        height: 20,
        fontSize: 15,
        textAlign: 'left',
    },
    roundtextinput:{
        borderRadius:5,
        height:45,
    },
    formgroup:{
        flex:1,
        flexDirection:'column',
        height: 30,
    },
    
    textinputCenter: {
        flex: 1,
        padding: 5,
        height: 50,
        fontSize: 15,
        textAlign: 'center',

    },
    primaryBKColor: {
        backgroundColor: theme.primaryColor,
    },
    icon: {
        color: 'white',
    },
    thumbnail: {
        width: 20,
    },
    heading1: {
        color: '#141414',
        fontSize: 17,
    },
    heading2: {
        color: '#313030',
        fontSize: 13,
        fontWeight: 'bold',
    },
    font11: {
        fontSize: 11,
    },
    font12: {
        fontSize: 12,
    },
    font13: {
        fontSize: 13,
    },
    font14: {
        fontSize: 14,
    },
    /*List Design Start */

    listItem: {
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: .5,
        marginLeft: 0,
        padding: 5,
        height: 60,


    },
    listLeft: {
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 0,
        marginLeft: 3,
    },
    listBody: {
        borderBottomWidth: 0,
        marginLeft: 5
    },
    listHeading: {
        color: 'black',
        fontSize: 16,
    },
    listHeadingHome: {
        color: 'black',
        fontSize: 15,
    },
    listRight: {
        borderBottomWidth: 0,
        padding: 0,
        width: 40,
        height: 40,
        alignItems: 'flex-end',

    },
    listRightOptionIcon: {
        fontSize: 20,
        color: 'silver',
        position: 'absolute',
        right: 0,
        top: 10,


    },
    listRightTouchable: {
        position: 'absolute',
        top: 10
    },
    listAvatarContainer: {
        borderRadius: 22,
        backgroundColor: '#e9ebeb',
        width: 46,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        /*borderColor: '#127461',
        borderWidth: 1,*/
        position: 'absolute',
        top: 2,
    },
    listAvatar: {
        width: 46,
        height: 46,

    },
    listAvatarContainerSmall: {
        marginTop: 5,
        borderRadius: 25,
        backgroundColor: 'white',
        padding: 2,
        width: 49,
        height: 49,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:'#1abc9c',
        borderWidth:2,
       
    },
    listAvatarHome: {
        width: 44,
        height: 44,
        //borderColor:'#1abc9c',
        //borderWidth:2,
        borderRadius: 22,
        //padding: 2,

    },
    listItemSmall: {
        borderTopColor: '#e5e5e5',
        borderTopWidth: .5,
        marginLeft: 0,
        padding: 5,
        height: 48,
    },

    listHeadingSmall: {
        color: 'black',
        fontSize: 10,
    },
    
    listAvatarSmall: {
        width: 46,
        height: 46,

    },
    /* List Design End */

    avatarContainer: {
        backgroundColor: 'white',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 40,
        width: 80,
        height: 80,
        padding: 2,
        alignSelf: "center",
        flexDirection: 'column',
        justifyContent: 'center',
        borderColor: '#383939',
        borderWidth: 1,
    },

    avatarcontainerbottom: {
        borderRadius: 50,
        backgroundColor: '#e2e0e0',
        padding: 2,
        width: 40,
        height: 40,
    },
    avatarBig: {
        borderRadius: 38,
        width: 76,
        height: 76,
    },
    avatar: {
        width: 46,
        height: 46,
    },

    avatarbottom: {
        width: 36,
        height: 36,
    },
    label: {
        color: theme.primaryColor,
        fontSize: 14,
        marginBottom:5,
        marginTop:5,
    },
    value: {
        color: 'black',
        fontSize: 17,
    },
    cardNavBar: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: 'red',
        width: '100%',
        alignItems: 'center',

    },
    cardNavFooter: {
        borderTopWidth: .5,
        borderTopColor: '#e4e5e5',
        width: '98%',
        alignSelf: "center",
        height: 35
    },
    navBarWrapperYellow: {
        height: 28,
        width: 28,
        borderRadius: 15,
        backgroundColor: '#edc901',
        justifyContent: 'center',
        alignItems: 'center'
    },
    navBarWrapperPrimary: {
        height: 28,
        width: 28,
        borderRadius: 15,
        backgroundColor: theme.primaryColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    navBarWrapperTransparent: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    navBarButton: {
        flex: 1,
        alignItems: 'center',
        padding: 2,
    },
    navBarIcon: {
        fontSize: 21,
        color: 'white',
        alignItems: 'center',
    },
    navBarLabel: {
        fontSize: 11,
        height: 15,
        color: 'white',
    },
    deleteButtonSmall: {
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 10,
        backgroundColor: 'red',
        borderRadius: 60,
        paddingTop: 3,
        height: 20,
        width: 80,
        alignSelf: "center",
        flexDirection: 'column',

    },
    marker: {
        alignSelf: 'center',
        width: 45,
        height: 55,
        margin: 0, padding: 0,
    },
    /*Modal Design Start*/
    modalWrapper: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        height: '100%',

        zIndex: 1000,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

    },
    modalContainer: {
        borderRadius: 6,
        backgroundColor: 'white',
        width: 340,
        alignSelf: "center",
        padding: 10,


    },
    modalAvatar: {
        marginLeft: 0,
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: .5,
        padding: 5
    },
    modalLeft: {
        width: 55,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalAvatarIcon: {
        color: '#818181'
    },
    modalHeader: {
        width: '100%',
        color: theme.primaryColor,
        fontSize: 15,
        padding: 10,
        marginBottom: 10,
        marginRight: 15,
        textAlign: 'center',


    },
    modalCancel: {
        textAlign: 'right',
        width: '100%',
        color: theme.lightColor,
        fontSize: 15,
        padding: 10,
        marginBottom: 15,
        marginRight: 15,

    },
    callOut: {
        width: 200,
        height: 50,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5,
        backgroundColor: 'white',
        borderColor: '#2c3e50',
        borderWidth: 1,
        borderRadius: 8,

    },
    callOutFix: {
        width: 160,
        height: 50,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        //marginBottom: 5,
        backgroundColor: 'white',
        //borderColor: 'gray',
        //borderWidth: 1,
        /*borderRadius: 8,*/
        //flex:1,

    },
    callOutContainer: {
        width: 170,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',

    },
    callOutContainerFix: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flex:1,
        flexDirection: 'row',


    },
    callOutText: {
        flex:1,
        width: 170,
        fontSize: 12,
        textAlign: 'center',
        color: 'black',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center'

    },
    callOutArrow: {
        height: 50,
        width: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    /*Model Design End*/
    mapMenu: {
        position: 'absolute',
        width: 46,
        left:0,
        //height: Dimensions.get('window').height ,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 20,
        marginTop: 20

        //backgroundColor: '#00000040'
        
    },
    mapTopMenu: {
        position: 'absolute',
        width: 46,
        height: 200,
        top: 10,
        padding: 5,

    },
    mapBottomMenu: {
        position: 'absolute',
        width: 50,
        height: 200,
        bottom: 150,
        padding: 5,
        marginLeft: 5,
    },
    fabMenuCircle: {
        backgroundColor: 'white',
        borderColor: '#2c3e50',
        borderWidth: 1,
    },
    mapMenuCircle: {
        width: 42,
        height: 42,
        backgroundColor: '#009ad6',
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ecedef',
        borderWidth: 2,
        marginTop: 3,
    },
    mapMenuRealtime:{
        width: 42,
        height: 42,
        backgroundColor: '#2ecc71',
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ecedef',
        borderWidth: 2,
        marginTop: 3,
      
    },
    mapMenuCircleMap: {
        width: 42,
        height: 42,
        backgroundColor: '#f79345',
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ecedef',
        borderWidth: 2,
        marginTop: 3,
    },
    mapMenuCircleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapMenuLabel: {
        color: '#34495e',
        fontSize: 9,
        fontWeight: 'bold' ,
        width: 46,
        textAlign: 'center',
        textShadowColor: 'white',
        textShadowOffset: { width:.5, height: .5 },
        textShadowRadius: 1,
    },
    noteLabel:{
        paddingLeft:15,
        paddingRight:15,
        textAlign:'justify',
        color:'#336e7b',
        marginBottom:10,
        fontSize: 16,
        lineHeight: 20,
    }
  

});


