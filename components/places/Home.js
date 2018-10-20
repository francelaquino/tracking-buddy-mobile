
import React, { Component } from 'react';
import {  Linking, StatusBar , AppState, Modal, BackHandler, AsyncStorage, NetInfo, TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, Dimensions, FlatList } from 'react-native';
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
import Moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import { displayHomeMember, displayMember, updateToken } from '../../redux/actions/memberActions';
import BackgroundGeolocation from "react-native-background-geolocation";
import firebase from 'react-native-firebase';
import type {  RemoteMessage, Notification, NotificationOpen } from 'react-native-firebase';
import AnimatedHideView from 'react-native-animated-hide-view';
var settings = require('../../components/shared/Settings');
var screenHeight = Dimensions.get('window').height; 


var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = .05;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var Model = DeviceInfo.getModel();
var timeZone = DeviceInfo.getTimezone();
var Manufacturer = DeviceInfo.getManufacturer();
class HomePlaces extends Component {
    constructor(props) {
        super(props)
        
       
        let self = this;
        this.map = null;
        this.markers=[];
        this.state = {
            //appState:AppState.currentState,
            active: true,
            useruid:'',
            firstname:'',
            isFloatingMenuVisible:false,
            mapMode:'standard',
            groupname: '',
            invitationcode:'',
            isLoading: true,
            memberReady: false,
            memberModal: false,
            fitToMap: true,
            latitude: 0,
            longitude: 0,
            firstname:'',
            avatar:'',
            emptyphoto:'1',
            firstletter:'',
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
        };

       

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
     componentWillMount() {

        let self = this;
       
        BackgroundGeolocation.on('http', function(response) {
            var status = response.status;
            var success = response.success;
            var responseText = response.responseText;
            console.log(response)
          }, function(response) {
            var success = response.success;
            var status = response.status;
              var responseText = response.responseText;
              console.log(response)
            });
        BackgroundGeolocation.on('heartbeat', function () {
            firebase.messaging().getToken()
                .then(fcmToken => {
                    userdetails.fcmtoken = fcmToken;
                    self.props.updateToken();
                });
        });

      

      

        BackgroundGeolocation.configure({

            locationAuthorizationAlert: {
                titleWhenNotEnabled: "Location services not enabled",
                titleWhenOff: "Location services is off",
                instructions: "You must enable in location services",
                cancelButton: "Cancel",
                settingsButton: "Settings"
            },
            locationAuthorizationRequest : "Always",
            notificationPriority: BackgroundGeolocation.NOTIFICATION_PRIORITY_MIN,
            stopTimeout: 5,
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            debug: true,
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 1,
            allowIdenticalLocations :false,
            maxDaysToPersist: 3,
            heartbeatInterval:120,
            notificationTitle: 'My GPS Buddy',
            notificationText: 'Using GPS',
            notificationChannelName:'My GPS Buddy',
            stopOnTerminate: false, 
            startOnBoot: true, 
            foregroundService: true,
            forceReloadOnBoot: true,
            url: 'http://tracking.findplace2stay.com/index.php/api/place/savelocation',
            method: 'POST',
            batchSync: false,       
            autoSync: true,       
            params: {             
                "useruid": userdetails.userid,
                "fcmtoken": userdetails.fcmtoken,
                "model": Model,
                "timezone": timeZone,
                "manufacturer": Manufacturer
            }
        }).then(state => {
          
            if (!state.enabled) {
                BackgroundGeolocation.start(function () {
                });
            }
            }).catch(error => {
            });

        //BackgroundGeolocation.start();
        
       
        /*BackgroundGeolocation.getCurrentPosition((location) => {
            console.log(location)
        }, (error) => {
        }, { samples: 1, persist: true,desiredAccuracy: 10,timeout: 30 })*/

       

       // this.initialize();
        
       
    }
       
    /*haddleAppStateChange = (nextAppState) => {
        this.setState({appState: nextAppState});
        
    }*/
     componentDidMount() {
         BackHandler.addEventListener('hardwareBackPress', () => { return true });
        let self = this;
        firebase.messaging().requestPermission();

        firebase.messaging().getToken()
            .then(fcmToken => {
                userdetails.fcmtoken = fcmToken;
                self.props.updateToken();

            });
            


        //AppState.addEventListener('change',this.haddleAppStateChange);

        firebase.messaging().onMessage((notification: RemoteMessage) => {
            const channel = new firebase.notifications.Android.Channel('My GPS Buddy', 'My GPS Buddy', firebase.notifications.Android.Importance.Max)
                .setDescription('My GPS Buddy');

            firebase.notifications().android.createChannel(channel);

            const notificationMessage = new firebase.notifications.Notification()
                .setNotificationId(notification._messageId)
                .setTitle(notification._data.title)
                .setBody(notification._data.body)
                .android.setPriority(firebase.notifications.Android.Priority.Max)
                .android.setChannelId('My GPS Buddy');

            firebase.notifications().displayNotification(notificationMessage);
            
        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            this.props.navigation.navigate("PlaceNotifications");
        });

        firebase.notifications().getInitialNotification()
            .then((notificationOpen: NotificationOpen) => {
                if (notificationOpen) {

                    this.props.navigation.navigate("PlaceNotifications");
                }
            });

       

       
      
           
    }

    componentWillUnmount() {
        //AppState.removeEventListener('change',this.haddleAppStateChange);
        BackgroundGeolocation.removeListeners();
        this.notificationOpenedListener();
       
    }
    


    async fitToMap() {
        this.setState({ isFloatingMenuVisible:false})
        let coordinates = [];
        if (this.props.members.length == 1) {
            this.map.animateToRegion({
                latitude: this.props.members[0].coordinates.latitude,
                longitude: this.props.members[0].coordinates.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            })

        } else if (this.props.members.length > 1) {

            for (let i = 0; i < this.props.members.length; i++) {
                const coord = {
                    coordinates: {
                        latitude: this.props.members[i].coordinates.latitude,
                        longitude: this.props.members[i].coordinates.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                }
                coordinates = coordinates.concat(coord.coordinates);
            }
            this.map.fitToCoordinates(coordinates, { edgePadding: { top: 250, right: 50, bottom: 300, left: 250 }, animated: false })
           



        }
        this.setState({ fitToMap:false})

    }

    async changeMapMode() {
        this.setState({ isFloatingMenuVisible:false})
        if (this.state.useruid !== "") {
            this.markers[this.state.useruid].hideCallout();
        }
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


    async centerToMarker(latitude, longitude,uid,firstname,avatar,firstletter,emptyphoto) {

       this.setState({ isFloatingMenuVisible:true,  useruid:uid, firstname:firstname,latitude:latitude,longitude:longitude, avatar:avatar,firstletter:firstletter,emptyphoto:emptyphoto})
        this.map.animateToRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        })
        this.markers[uid].showCallout();





    }

    async centerToUserMarker() {
        this.setState({ isFloatingMenuVisible: false })
        if (this.state.useruid !== "") {
            this.markers[this.state.useruid].hideCallout();
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                this.map.animateToRegion({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005
                })

            },
            (err) => {
            },
            { enableHighAccuracy: false, timeout: 20000}
        );

    }
    async allMembers() {
        let self = this;
        if (this.state.useruid !== "") {
            this.markers[this.state.useruid].hideCallout();
        }
        userdetails.group = "";
        this.setState({ isLoading: true, groupname: '', isFloatingMenuVisible:false })
        await self.props.displayHomeMember().then(res => {
            setTimeout(async () => {
                await self.fitToMap();
                this.setState({ isLoading: false })
            }, 10);
        });
    }

   
    changeGroup = (groupname) => {
        this.reload();
        this.setState({ groupname: groupname, isFloatingMenuVisible:false });
        if (this.state.useruid !== "") {
            this.markers[this.state.useruid].hideCallout();
        }

    }
    async reload() {
        let self = this;
        this.setState({ isLoading: true, isFloatingMenuVisible:false })
        await self.props.displayHomeMember().then(res => {
            setTimeout(async () => {
                await self.fitToMap();
                this.setState({ isLoading: false })
            }, 10);
        });
    }


    initialize() {
        let self = this;
       
       
        //setTimeout(() => {
            //this.setState({ isLoading: false })
            firebase.database().ref('users/' + userdetails.userid).child('members').on("value", function (snapshot) {
                if (userdetails.userid !== "" && userdetails.userid !== null) {
                    self.props.displayHomeMember().then(res => {
                        setTimeout( () => {
                            if (self.state.fitToMap == true) {
                                 self.fitToMap();
                            }
                            if (self.props.members.length <= 0) {
                                self.centerToUserMarker();
                            }
                            self.setState({ memberReady: true, isLoading: false })
                        }, 500);

                    });
                }
            });

           //}, 1000);
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




    renderMember() {
        return (
            <FlatList
                style = {{ flex: 1 }}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.uid.toString()}
                horizontal={true}
                data={this.props.members}
                renderItem={({ item }) => (
                    <TouchableOpacity key={item.uid.toString()} onPress={() => this.centerToMarker(item.coordinates.latitude, item.coordinates.longitude,item.uid,item.firstname,item.avatar,item.firstletter,item.emptyphoto)}>
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', width: 55, height: 60, margin: 2,  }}>
                            <View style={globalStyle.listAvatarContainerSmall} >
                                {item.emptyphoto === "1" ?  <Text style={{fontSize:23,color:'silver'}}>{item.firstletter}</Text> :
                                    <Thumbnail style={globalStyle.listAvatarHome} source={{ uri: item.avatar }} />
                                }
                            </View>
                            <Text numberOfLines={1} style={[globalStyle.mapMenuLabel,{width:'100%',fontSize:12}]} >{item.firstname}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />)
    }

    ready() {


        const markers = this.props.members.map(marker => (
            <MapView.Marker key={marker.uid}
                identifier={marker.uid}
                ref={ref => { this.markers[marker.uid] = ref }}
                coordinate={marker.coordinates}
                title={marker.firstname}>
                <Image style={styles.marker}
                    source={require('../../images/marker.png')} />
                <Text style={styles.markerText}>{marker.firstname}</Text>

                <MapView.Callout  tooltip={false}  onPress={() => this.props.navigation.navigate("RealTimeLocation", { uid: marker.uid, name: marker.firstname })}  >
                    <View style={globalStyle.callOutFix} >
                    <Text numberOfLines={2} style={globalStyle.callOutText}>{marker.address}</Text>
                        
                  

                    </View>


                </MapView.Callout>
            </MapView.Marker>

        ));

       

        return (

            <Root>
                    <Loader loading={this.state.isLoading} />
                    <OfflineNotice />
                    <Container style={globalStyle.containerWrapper}>

                   
                       
                    <Header style={globalStyle.header}>
                        <StatusBar backgroundColor="#149279" />
                            <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => this.props.navigation.navigate('Menu')} >
                                    <SimpleLineIcons size={20} name='menu' style={globalStyle.headerLeftMenuIcon} />
                                </Button>
                            </Left>
                            <Body style={globalStyle.headerBody}>
                                <Title numberOfLines={1} style={globalStyle.headerTitle}>MY GPS BUDDY </Title>
                            </Body>
                            <Right style={globalStyle.headerRight} >
                               
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('UserProfile')}>
                                <View style={[globalStyle.listAvatarContainerSmall, { height: 40, width: 40, marginTop: 2, borderWidth: 1, borderColor:'#127461' }]} >
                                    {userdetails.emptyphoto === "1" ? <Ionicons size={36} style={{ color: '#127461' }} name="ios-person" /> :
                                        <Thumbnail style={[globalStyle.listAvatar, { height: 36, width: 36 }]} source={{ uri: userdetails.avatar }} />
                                    }
                                </View>
                                </TouchableOpacity>



                            </Right>

                        </Header>

                        <View style={styles.mainContainer}>
                        

                        <View style={styles.mapContainer}>
                            <Image style={[styles.marker, { opacity:0 }]}
                                        source={require('../../images/marker.png')} />
                            <MapView ref={map => { this.map = map }} onPress={() => this.setState({ isFloatingMenuVisible: false })}
                                onMapReady={() => this.initialize()}
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
                                {markers}

                                </MapView>
                                
                            </View>



                        {this.state.groupname !== '' &&
                            <View>
                            <View style={{ flexDirection: 'column', opacity: .5, backgroundColor: '#16a085', marginVertical: 5, width: '100%', alignItems: 'center', position: 'absolute', top: -5, height: 40, }}>

                            </View>
                            <View>
                                <Text style={{ fontSize: 15, paddingTop: 9, zIndex: 99999, width: 250, height: 30, color: 'white', textAlign: 'center', alignSelf: "center", flexDirection: 'column' }}>{this.state.groupname} Group</Text>
                            </View>
                        </View>
                            }
                        <View style={globalStyle.mapMenu}>

                            <TouchableOpacity style={globalStyle.mapMenuCircle} onPress={() => this.props.navigation.navigate('GenerateInviteCode')} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons  size={23} style={{ color: 'white' }} name="user-following" />
                                </View>
                            </TouchableOpacity>
                            <Text style={globalStyle.mapMenuLabel}>Invite Member </Text>


                            <TouchableOpacity style={globalStyle.mapMenuCircle} onPress={() => this.props.navigation.navigate('NewInvite')} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{color: 'white' }} name="user-follow" />
                                </View>
                            </TouchableOpacity>
                            <Text style={globalStyle.mapMenuLabel}>Add Member </Text>


                            <TouchableOpacity  style={globalStyle.mapMenuCircle} onPress={() => this.allMembers()} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{color: 'white' }} name="people" />
                                </View>
                            </TouchableOpacity >
                            <Text style={globalStyle.mapMenuLabel}>Show Members </Text>

                            <TouchableOpacity style={globalStyle.mapMenuCircle} onPress={() => this.props.navigation.navigate('SelectGroup', { changeGroup: this.changeGroup })}  >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{ color: 'white' }} name="organization" />
                                </View>
                            </TouchableOpacity>
                            <Text style={globalStyle.mapMenuLabel}>Switch Group </Text>

                            <TouchableOpacity style={globalStyle.mapMenuCircleMap} onPress={() => this.centerToUserMarker()} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{color: 'white' }} name="compass" />
                                </View>
                            </TouchableOpacity>
                            <Text style={globalStyle.mapMenuLabel}>My Location </Text>
                            <TouchableOpacity style={globalStyle.mapMenuCircleMap} onPress={() => this.fitToMap()} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{color: 'white' }} name="size-actual" />
                                </View>
                            </TouchableOpacity>
                            <Text style={globalStyle.mapMenuLabel}>Fit to Map </Text>
                            <TouchableOpacity style={globalStyle.mapMenuCircleMap} onPress={() => this.changeMapMode()} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{color: 'white' }} name="globe" />
                                </View>
                            </TouchableOpacity>
                            <Text style={globalStyle.mapMenuLabel}>Map Style </Text>


                           
                            
                           
                            </View>
                            

                            <View style={styles.memberContainer} >
                            
                                {this.state.memberReady &&
                                    this.renderMember()
                                }
                        </View>
                        <AnimatedHideView visible={this.state.isFloatingMenuVisible} duration={700}
                            style={{  position:'absolute',bottom:80,right:1, padding:10,backgroundColor:'transparent',height:240,width:180,borderRadius:5,marginBottom:5 }}>
                             <View style={{  flexDirection: 'column', alignItems: 'center', width: 120, height: 60, margin: 2,  }}>
                            <View style={globalStyle.listAvatarContainerSmall} >
                                {this.state.emptyphoto === "1" ?  <Text style={{fontSize:23,color:'silver'}}>{this.state.firstletter}</Text> :
                                    <Thumbnail style={globalStyle.listAvatarHome} source={{ uri: this.state.avatar }} />
                                }
                            </View>
                            <Text numberOfLines={1} style={[globalStyle.mapMenuLabel,{width:'100%',fontSize:12,color:'#d35400'}]} >{this.state.firstname}</Text>
                        </View>
                            <View style={{flexDirection:'row',height:40,marginBottom:5}}>
                                <Text style={{ color:'white',padding:2,borderRadius:5,height:25,marginRight:5,width:120,textAlign:'center',marginTop:12,backgroundColor:'#2c3e50', textAlignVertical: 'center',fontSize:12}}>Real Time Location</Text>
                            <TouchableOpacity style={globalStyle.mapMenuRealtime} onPress={() => this.props.navigation.navigate("RealTimeLocation", { uid: this.state.useruid,name: this.state.firstname })}  >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons  size={22} style={{ color: 'white' }} name="speedometer" />
                                </View>
                            </TouchableOpacity>
                            </View>
                            <View style={{flexDirection:'row',height:40,marginBottom:5}}>
                                <Text style={{ color:'white',padding:2,borderRadius:5,height:25,marginRight:5,width:120,textAlign:'center',marginTop:12,backgroundColor:'#2c3e50', textAlignVertical: 'center',fontSize:12}}>Location History</Text>
                            <TouchableOpacity style={globalStyle.mapMenuRealtime} onPress={() => this.props.navigation.navigate("LocationPlaces", { uid: this.state.useruid, name: this.state.firstname })}  >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons  size={22} style={{ color: 'white' }} name="map" />
                                </View>
                            </TouchableOpacity>
                            </View>

                            <View style={{flexDirection:'row',height:40}}>
                                <Text style={{ color:'white',padding:2,borderRadius:5,height:25,marginRight:5,width:120,textAlign:'center',marginTop:12,backgroundColor:'#2c3e50', textAlignVertical: 'center',fontSize:12}}>Start Navigation</Text>
                            <TouchableOpacity style={globalStyle.mapMenuRealtime} onPress={() =>  this.startNavigation() } >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons  size={22} style={{ color: 'white' }} name="cursor" />
                                </View>
                            </TouchableOpacity>
                            </View>

                           

                           
                            </AnimatedHideView>

                       
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
          height:'104%',
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
    members: state.fetchMember.home_members,
    isConnected:state.fetchConnection.isConnected,
    
  })
  
  
  
HomePlaces = connect(mapStateToProps, { displayHomeMember, displayMember, updateToken})(HomePlaces);
  
export default HomePlaces;