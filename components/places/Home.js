
import React, { Component } from 'react';
import { StatusBar , AppState, Modal, BackHandler, AsyncStorage, NetInfo, TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, Dimensions, FlatList } from 'react-native';
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
import { displayHomeMember, displayMember, updateToken } from '../../redux/actions/memberActions';
import BackgroundGeolocation from "react-native-background-geolocation";
import firebase from 'react-native-firebase';
import type {  RemoteMessage, Notification, NotificationOpen } from 'react-native-firebase';
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


class HomePlaces extends Component {
    constructor(props) {
        super(props)
        
       
        let self = this;
        this.map = null;
        this.markers=[];
        this.state = {
            appState:AppState.currentState,
            active: true,
            mapMode:'standard',
            groupname: '',
            invitationcode:'',
            isLoading: false,
            memberReady: false,
            memberModal: false,
            fitToMap: true,
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
        };

       

    }


    async componentWillMount() {
       
        let self = this;
       
      /*  BackgroundGeolocation.on('http', function(response) {
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
            */
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
            stopTimeout: 1,
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            debug: true,
            desiredAccuracy: 0,
            distanceFilter: 1,
            allowIdenticalLocations :false,
            maxDaysToPersist: 3,
            heartbeatInterval:120,
            foregroundService: true,
            notificationTitle: 'My GPS Buddy',
            notificationText: 'Using GPS',
            notificationChannelName:'My GPS Buddy',
            stopOnTerminate: false, 
            startOnBoot: true, 
            url: 'http://tracking.findplace2stay.com/index.php/api/place/savelocation',
            method: 'POST',
            batchSync: false,       
            autoSync: true,       
            params: {             
                "useruid": userdetails.userid,
                "fcmtoken": userdetails.fcmtoken,
            }
        }).then(state => {
            if (!state.enabled) {
                BackgroundGeolocation.start(function () {
                });
            }
            }).catch(error => {
        });

        /*
       
        BackgroundGeolocation.getCurrentPosition((location) => {
            self.props.getAddress(location.coords);
           
           
        }, (error) => {
        }, { samples: 1, persist: true,desiredAccuracy: 10,timeout: 30 });*/

        this.initialize();
        
       
    }
       
    haddleAppStateChange = (nextAppState) => {
        this.setState({appState: nextAppState});
        
    }
    async componentDidMount() {
        let self = this;
        firebase.messaging().requestPermission();

        firebase.messaging().getToken()
            .then(fcmToken => {
                userdetails.fcmtoken = fcmToken;
                self.props.updateToken();

            });
            


        AppState.addEventListener('change',this.haddleAppStateChange);

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
        AppState.removeEventListener('change',this.haddleAppStateChange);
        BackgroundGeolocation.removeListeners();
        this.notificationOpenedListener();
       
    }
    


    async fitToMap() {
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
            this.map.fitToCoordinates(coordinates, { edgePadding: { top: 200, right: 100, bottom: 200, left: 100 }, animated: false })
           



        }
        this.setState({ fitToMap:false})

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


    async centerToMarker(latitude, longitude,uid) {

       
        this.map.animateToRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        })
        this.markers[uid].showCallout();


    }

    async centerToUserMarker() {
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
            { enableHighAccuracy: true, timeout: 20000}
        );

    }
    async allMembers() {
        let self = this;
        userdetails.group = "";
        this.setState({ isLoading: true, groupname:'' })
        await self.props.displayHomeMember().then(res => {
            setTimeout(async () => {
                await self.fitToMap();
                this.setState({ isLoading: false })
            }, 10);
        });
    }

   
    changeGroup = (groupname) => {
        this.reload();
        this.setState({ groupname: groupname });

    }
    async reload() {
        let self = this;
        this.setState({ isLoading:true })
        await self.props.displayHomeMember().then(res => {
            setTimeout(async () => {
                await self.fitToMap();
                this.setState({ isLoading: false })
            }, 10);
        });
    }


    initialize() {
        let self = this;
       
       
        setTimeout(() => {
            this.setState({ isLoading: false })
            firebase.database().ref('users/' + userdetails.userid).child('members').on("value", function (snapshot) {
                if (userdetails.userid !== "" && userdetails.userid !== null) {
                    self.props.displayHomeMember().then(res => {
                        setTimeout( () => {
                            if (self.state.fitToMap == true) {
                                 self.fitToMap();
                            }
                            self.setState({ memberReady: true, isLoading: false })
                        }, 500);
                    });
                }
            });

           }, 1000);
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
                keyExtractor={item => item.uid.toString()}
                horizontal={true}
                data={this.props.members}
                renderItem={({ item }) => (
                    <TouchableOpacity key={item.uid.toString()} onPress={() => this.centerToMarker(item.coordinates.latitude, item.coordinates.longitude,item.uid)}>
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', width: 80, height: 60, margin: 2, backgroundColor: '#2c3e50', borderRadius:10, }}>
                            <View style={globalStyle.listAvatarContainerSmall} >
                                {item.emptyphoto === "1" ? <Ionicons size={46} style={{ color: '#2c3e50' }} name="ios-person" /> :
                                    <Thumbnail style={globalStyle.listAvatar} source={{ uri: item.avatar }} />
                                }
                            </View>
                            <Text numberOfLines={1} style={{ color: 'white', fontSize: 12 }}>{item.firstname}</Text>
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

                <MapView.Callout  tooltip={true}  onPress={() => this.props.navigation.navigate("RealTimeLocation", { uid: marker.uid, name: marker.firstname })}  >
                    <View style={globalStyle.callOutFix} >
                    <Text numberOfLines={2} style={globalStyle.callOutText}>{marker.address}</Text>
                        
                    <Button bordered light full style={globalStyle.calloutButton}>
                                        <Text style={{ color: 'white',fontSize:11 }}>Track Realtime</Text>
                                    </Button>

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
                                <Title numberOfLines={1} style={globalStyle.headerTitle}>My GPS Buddy </Title>
                            </Body>
                            <Right style={globalStyle.headerRight} >
                               
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('UserProfile')}>
                                <View style={[globalStyle.listAvatarContainerSmall, { height: 40, width: 40, marginTop: 2, borderWidth: 1, borderColor:'black' }]} >
                                    {userdetails.emptyphoto === "1" ? <Ionicons size={36} style={{ color: '#2c3e50' }} name="ios-person" /> :
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
                                    <MapView ref={map => { this.map = map }}
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




                        <View style={globalStyle.mapMenu}>

                            <Button style={globalStyle.mapMenuCircle} onPress={() => this.props.navigation.navigate('GenerateInviteCode')} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons  size={23} style={{ color: 'white' }} name="user-following" />
                                </View>
                            </Button>
                            <Text style={globalStyle.mapMenuLabel}>Invite Member </Text>


                            <Button style={globalStyle.mapMenuCircle} onPress={() => this.props.navigation.navigate('NewInvite')} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{color: 'white' }} name="user-follow" />
                                </View>
                            </Button>
                            <Text style={globalStyle.mapMenuLabel}>Add Member </Text>


                            <Button style={globalStyle.mapMenuCircle} onPress={() => this.allMembers()} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{color: 'white' }} name="people" />
                                </View>
                            </Button>
                            <Text style={globalStyle.mapMenuLabel}>Show Members </Text>

                            <Button style={globalStyle.mapMenuCircle} onPress={() => this.changeGroup() } >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{ color: 'white' }} name="organization" />
                                </View>
                            </Button>
                            <Text style={globalStyle.mapMenuLabel}>Switch Group </Text>

                            <Button style={globalStyle.mapMenuCircleMap} onPress={() => this.centerToUserMarker()} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{color: 'white' }} name="compass" />
                                </View>
                            </Button>
                            <Text style={globalStyle.mapMenuLabel}>My Location </Text>
                            <Button style={globalStyle.mapMenuCircleMap} onPress={() => this.fitToMap()} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{color: 'white' }} name="size-actual" />
                                </View>
                            </Button>
                            <Text style={globalStyle.mapMenuLabel}>Fit to Map </Text>
                            <Button style={globalStyle.mapMenuCircleMap} onPress={() => this.changeMapMode()} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{color: 'white' }} name="globe" />
                                </View>
                            </Button>
                            <Text style={globalStyle.mapMenuLabel}>Map Style </Text>


                           
                            
                           
                            </View>
                            {this.state.groupname !== '' &&
                                <View style={{ flexDirection: 'column', marginVertical: 5, width: '100%', alignItems: 'center', position: 'absolute', bottom: 80 }}>
                                    <Text style={{ paddingTop: 5, opacity: .5, borderRadius: 10, backgroundColor: 'black', width: 250, height: 30, color: 'white', textAlign: 'center', alignSelf: "center", flexDirection: 'column' }}>{this.state.groupname} Group</Text>
                                </View>
                            }
                            <View style={styles.memberContainer} >
                                {this.state.memberReady &&
                                    this.renderMember()
                                }
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
    members: state.fetchMember.home_members,
    isConnected:state.fetchConnection.isConnected,
    
  })
  
  
  
HomePlaces = connect(mapStateToProps, { displayHomeMember, displayMember, updateToken})(HomePlaces);
  
export default HomePlaces;