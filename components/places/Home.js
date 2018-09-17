
import React, { Component } from 'react';
import { AppState, Modal, BackHandler, AsyncStorage, NetInfo, TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, Dimensions, FlatList } from 'react-native';
import { Fab , Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch, Thumbnail,Card,CardItem } from 'native-base';
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
import { displayHomeMember, displayMember } from '../../redux/actions/memberActions';
import {  getAddress } from '../../redux/actions/locationActions';
import BackgroundGeolocation from "react-native-background-geolocation";
import firebase from 'react-native-firebase';
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
            active: true,
            mapMode:'standard',
            groupname: '',
            invitationcode:'',
            isLoading: false,
            memberReady: false,
            memberModal: false,
            fitToMap: true,
            address:'',
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
       
        BackgroundGeolocation.on('http', function(response) {
            var status = response.status;
            var success = response.success;
            var responseText = response.responseText;
            console.log(responseText);
          }, function(response) {
            var success = response.success;
            var status = response.status;
            var responseText = response.responseText;
            console.log("- HTTP failure: ", status, responseText);
          });
       

        BackgroundGeolocation.ready({
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
            desiredAccuracy: 10,
            distanceFilter: 1,
            allowIdenticalLocations :false,
            maxDaysToPersist: 1,
            foregroundService: true,
            notificationTitle: 'Tracking Buddy',
            notificationText: 'Using GPS',
            notificationChannelName:'Traking Buddy',
            stopOnTerminate: false, 
            startOnBoot: true, 
            url: 'http://tracking.findplace2stay.com/index.php/api/place/savelocation',
            method: 'POST',
            batchSync: false,       
            autoSync: true,       
            params: {             
                "useruid": userdetails.userid,
            }
        }).then(state => {
            if (!state.enabled) {
                BackgroundGeolocation.start(function () {
                });
            }
        }).catch(error => {
        });

        
       
        BackgroundGeolocation.getCurrentPosition((location) => {
            self.props.getAddress(location.coords);
            console.log(location)
           
           
        }, (error) => {
        }, { samples: 1, persist: true,desiredAccuracy: 10,timeout: 30 });

        this.initialize();


      
       
    }
       

    componentDidmount() {
      
    }

    componentWillUnmount() {
        BackgroundGeolocation.removeListeners();
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

                <MapView.Callout tooltip={true} onPress={() => this.props.navigation.navigate("LocationPlaces", { uid: marker.uid, name: marker.firstname })} >
                    <View style={globalStyle.callOutFix} >
                        <View style={globalStyle.callOutContainerFix} >
                            <Text numberOfLines={2} style={globalStyle.callOutText}>{marker.address}</Text>
                        </View>
                        <View style={globalStyle.callOutArrow}>
                            <SimpleLineIcons style={{ fontSize: 13, color: '#1abc9c' }} name='arrow-right' />
                        </View>

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
                            <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => this.props.navigation.navigate('Menu')} >
                                    <SimpleLineIcons size={20} name='menu' style={globalStyle.headerLeftMenuIcon} />
                                </Button>
                            </Left>
                            <Body style={globalStyle.headerBody}>
                                <Title numberOfLines={1} style={globalStyle.headerTitle}>{this.props.address} </Title>
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

                        <View style={{ flex: 1 }}>
                            <Fab
                                active={this.state.active}
                                direction="down"
                                containerStyle={{ position: 'absolute',left:1 }}
                                style={{ backgroundColor: '#34495e', width: 45, height: 45,top:4, }}
                            position="topLeft"
                                onPress={() => this.setState({ active: !this.state.active })}>
                                {this.state.active === true ?
                                    <Ionicons style={{ color: 'white' }} name="ios-close" /> :
                                    <Ionicons style={{ color: 'white' }} name="ios-add" />
                                }
                                <Button style={globalStyle.fabMenuCircle} onPress={() => this.props.navigation.navigate('NewInvite')} >
                                    <Ionicons size={30} style={{ color: '#2c3e50' }} name="ios-person-add" />
                                </Button>
                                <Button style={globalStyle.fabMenuCircle} onPress={() => this.allMembers()}>
                                    <Ionicons size={30} style={{ color: '#2c3e50' }} name="ios-person" />
                                </Button>
                                <Button style={globalStyle.fabMenuCircle} onPress={() => this.props.navigation.navigate('SelectGroup', { changeGroup: this.changeGroup })}>
                                    <Ionicons size={30} style={{ color: '#2c3e50' }} name="ios-people" />
                                </Button>
                                <Button style={globalStyle.fabMenuCircle} onPress={() => this.centerToUserMarker()}>
                                    <MaterialIcons size={25} style={{ color: '#2c3e50' }} name="my-location" />
                                </Button>
                                <Button style={globalStyle.fabMenuCircle} onPress={() => this.fitToMap()}>
                                    <MaterialIcons size={25} style={{ color: '#2c3e50' }} name="zoom-out-map" />
                                </Button>
                                <Button style={globalStyle.fabMenuCircle} onPress={() => this.changeMapMode()}>
                                    <Entypo size={25} style={{ color: '#2c3e50' }} name="globe" />
                                    </Button>
                            </Fab>
                        </View>
                        </View>




                        

                    
                    </Container>
                </Root>

        )
    }



    render() {
        return this.ready();


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
    address: state.fetchLocation.address,
    isConnected:state.fetchConnection.isConnected,
    
  })
  
  
  
HomePlaces = connect(mapStateToProps, { displayHomeMember, displayMember, getAddress})(HomePlaces);
  
export default HomePlaces;