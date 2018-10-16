
import React, { Component } from 'react';
import { Linking, StatusBar , AppState, Modal, BackHandler, AsyncStorage, NetInfo, TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, Dimensions, FlatList } from 'react-native';
import { ActionSheet , Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch, Thumbnail,Card,CardItem } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, {  Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Loading  from '../shared/Loading';
import Loader  from '../shared/Loader';
import OfflineNotice  from '../shared/OfflineNotice';
import { connect } from 'react-redux';
import axios from 'axios';
import Moment from 'moment';
import { displayHomeMember, displayMember, updateToken } from '../../redux/actions/memberActions';
import BackgroundGeolocation from "react-native-background-geolocation";
import firebase from 'react-native-firebase';
import type {  RemoteMessage, Notification, NotificationOpen } from 'react-native-firebase';
var settings = require('../../components/shared/Settings');
var screenHeight = Dimensions.get('window').height; 


var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');
const screen = Dimensions.get('window');
var LATITUDE_DELTA = .005;
var LONGITUDE_DELTA = .005;

class RealTimeLocation extends Component {
    constructor(props) {
        super(props)
        this.map = null;
        this.state = {
            mapMode:'standard',
            longitude:49.566759,
            latitude: 27.159915,
            isReady:false,
           
        };

       

    }

    componentWillUnmount() {
        this.map=null;
    }
    
    componentDidMount() {
        
       
    }
       

    mapReady() {
        let self = this;
        this.setState({ isReady:true })
      
        setTimeout(()=>{
           
                firebase.database().ref('users/' + this.props.navigation.state.params.uid).on("value", function (snapshot) {
                    if (self.map!=null) {
                    self.map.animateToRegion({
                        latitude: Number(snapshot.val().latitude),
                        longitude: Number(snapshot.val().longitude),
                        longitudeDelta: LONGITUDE_DELTA,
                        latitudeDelta: LATITUDE_DELTA
                    })
                    self.setState({ latitude: Number(snapshot.val().latitude), longitude: Number(snapshot.val().longitude) })
                }

                });
            }, 500);

    }
    loading() {
        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                    <Loading />
                </Container>
            </Root>
        )
    }
    startNavigation(){
        if(Platform.OS === 'ios'){
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    Linking.openURL('maps://app?saddr='+ position.coords.latitude +'+'+position.coords.longitude+'&daddr='+this.state.latitude+'+'+this.state.longitude)

                    

                },
                (err) => {
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
            
        } else{
            Linking.openURL('google.navigation:q='+this.state.latitude+'+'+this.state.longitude)
        }
    }



    async changeMapMode() {
        if (this.state.mapMode == "standard") {
            this.setState({
                mapMode: 'satellite'
            });
        } else {
            this.setState({
                mapMode: 'standard'
            });
        }

    }
    async fitToMap() {
        this.map.animateToRegion({
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        })
    }

    ready() {


       
       

        return (

            <Root>
                    <OfflineNotice />
                    <Container style={globalStyle.containerWrapper}>

                   <Header style={globalStyle.header}>
                        <StatusBar backgroundColor="#149279" />
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />
                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody}>
                            <Title>REALTIME LOCATION</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}>
                        </Right>
                    </Header>


                        <View style={styles.mainContainer}>
                        

                        <View style={styles.mapContainer}>
                            <Image style={[styles.marker, { opacity:0 }]}
                                        source={require('../../images/marker.png')} />
                                    <MapView ref={map => { this.map = map }}
                                    onMapReady = { () => this.mapReady() }
                                    provider={PROVIDER_GOOGLE}
                                    customMapStyle={settings.retro}
                                    mapType={this.state.mapMode}
                                    showsUserLocation={true}
                                    showsMyLocationButton={false}
                                    followsUserLocation={true}
                                    loadingEnabled={true}
                                zoomEnabled={true}
                                    style={styles.map}
                            >
                                <MapView.Marker 
                                    coordinate={{latitude:this.state.latitude , longitude:this.state.longitude}}>
                                    <Image style={styles.marker}
                                        source={require('../../images/marker.png')} />
                                    <Text style={styles.markerText}>{this.props.navigation.state.params.name}</Text>
                                </MapView.Marker>

                                </MapView>
                                
                            </View>




                        <View style={globalStyle.mapMenu}>

                           
                           <TouchableOpacity style={globalStyle.mapMenuCircle} onPress={() => { this.props.navigation.navigate("LocationPlaces", { uid: this.props.navigation.state.params.uid, name: this.props.navigation.state.params.name })}}  >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{color: 'white' }} name="map" />
                                </View>
                            </TouchableOpacity>
                            <Text style={globalStyle.mapMenuLabel}>Location History </Text>
                            
                            <TouchableOpacity style={globalStyle.mapMenuCircleMap} onPress={() => this.fitToMap()} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{color: 'white' }} name="size-actual" />
                                </View>
                            </TouchableOpacity>

                            <Text style={globalStyle.mapMenuLabel}>Center Map </Text>

                            <TouchableOpacity style={globalStyle.mapMenuCircleMap} onPress={() => this.changeMapMode()} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{color: 'white' }} name="globe" />
                                </View>
                            </TouchableOpacity>
                            <Text style={globalStyle.mapMenuLabel}>Map Style </Text>

                            <TouchableOpacity style={globalStyle.mapMenuCircleMap} onPress={() => this.startNavigation()} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{color: 'white' }} name="cursor" />
                                </View>
                            </TouchableOpacity>
                            <Text style={globalStyle.mapMenuLabel}>Start Navigation </Text>

                            


                           
                            
                           
                            </View>
                           
                            
                       
                        </View>




                        

                    
                    </Container>
                </Root>

        )
    }



    render() {
                return this.ready()

    }
}



const styles = StyleSheet.create({
    mainContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
    navBar: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        padding:2,
        backgroundColor: '#1eaec5',
        alignItems:'center',
        borderTopWidth:0,
    },
    
    mapContainer: {
        
      flex: 1,
      display: 'flex',
      borderBottomColor:'silver',
      borderBottomWidth:.5,
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
      
    },
    memberContainer: {
        height: 80,
        width:'100%',
        paddingTop:2,
        alignItems: 'center',
        bottom:0,
        position: 'absolute',
        backgroundColor: 'transparent',
        marginBottom:5,
  
        
    },
   
      map: {
          
        ...StyleSheet.absoluteFillObject,
      },
      marker: {
        alignSelf: 'center',
        width:55,
        height:68,
        margin:0,padding:0 
    },

    markerText: {
        textAlign: 'center',
        flex: 1,
        color: 'black',
        fontSize: 9,
        width: 45,
        marginLeft: 5,
        marginTop: 17,
        position: 'absolute',


    },
    
  });


const mapStateToProps = state => ({
    
  })
  
  
  
RealTimeLocation = connect(mapStateToProps, { })(RealTimeLocation);
  
export default RealTimeLocation;