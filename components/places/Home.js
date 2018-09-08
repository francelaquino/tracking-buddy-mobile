
import React, { Component } from 'react';
import { AppState, Modal, BackHandler, AsyncStorage, NetInfo, TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, Dimensions, FlatList } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch, Thumbnail,Card,CardItem } from 'native-base';
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
import { displayHomeMember, displayMember, addMember } from '../../redux/actions/memberActions';
import { saveLocationOnline, pushLocationOnline, saveLocationOffline, saveLocation } from '../../redux/actions/locationActions';
import axios from 'axios';
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
            mapMode:'standard',
            groupname: '',
            invitationcode:'',
            isLoading: false,
            memberReady: false,
            memberModal: false,
            locationModal: false,
            fitToMap:true,
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
        };

        
        

    }


    componentWillUnmount() {
        
    }
   
   
    async componentDidMount() {
       

        BackHandler.addEventListener('hardwareBackPress', function () {
            return true;
        });

      

       


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


    componentWillMount() {
        this.initialize();

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
        self.props.displayHomeMember().then(res => {
            setTimeout(async () => {
                if (self.state.fitToMap == true) {
                    await self.fitToMap();
                }
                self.setState({ memberReady: true, isLoading: false })
            }, 10);
        });
        setTimeout(() => {
        this.setState({ isLoading: false })
            /*firebase.database().ref('users/' + userdetails.userid).child('members').on("value", function (snapshot) {
                if (userdetails.userid !== "" && userdetails.userid !== null) {
                    self.props.displayHomeMember().then(res => {
                        setTimeout(async () => {
                            if (self.state.fitToMap == true) {
                                await self.fitToMap();
                            }
                            self.setState({ memberReady: true, isLoading: false })
                        }, 10);
                    });
                }
            });*/

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



    onSubmitCode() {
        if (this.state.invitationcode == "") {
            return false;
        }
        this.setState({ loading: true })
        this.props.addMember(this.state.invitationcode).then(async res => {
            if (res == true) {
                await this.props.displayMember();
                await this.props.displayHomeMember();
                this.setState({ invitationcode: '', loading: false, memberModal:false })
            } else {
                this.setState({ invitationcode: '', loading: false })
            }
        });
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
                                <View style={[globalStyle.listAvatarContainerSmall, { height: 40, width: 40, marginTop: 2 }]} >
                                    {userdetails.emptyphoto === "1" ? <Ionicons size={36} style={{ color: '#2c3e50' }} name="ios-person" /> :
                                        <Thumbnail style={[globalStyle.listAvatar, { height: 36, width: 36 }]} source={{ uri: userdetails.avatar }} />
                                    }
                                </View>
                                </TouchableOpacity>



                            </Right>

                        </Header>

                        <View style={styles.mainContainer}>

                            <View style={styles.mapContainer}>
                                    <Image  style={styles.marker}
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
                                   

                                </MapView>
                                
                            </View>




                        <View style={globalStyle.mapMenu}>

                            <TouchableOpacity onPress={() => this.setState({ memberModal: true })}>
                                <View style={globalStyle.mapMenuCircle} >
                                    <Ionicons size={30} style={{ color: '#2c3e50' }} name="ios-person-add" />
                                </View>
                                <Text style={globalStyle.mapMenuLabel}>Add Member</Text>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.allMembers()}>
                                <View style={globalStyle.mapMenuCircle} >
                                    <Ionicons size={30} style={{ color: '#2c3e50' }} name="ios-person" />
                                </View>
                                <Text style={globalStyle.mapMenuLabel}>Members</Text>

                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginBottom:30 }} onPress={() => this.props.navigation.navigate('SelectGroup', { changeGroup: this.changeGroup })}>
                                <View style={globalStyle.mapMenuCircle} >
                                    <Ionicons size={30} style={{ color: '#2c3e50' }} name="ios-people" />
                                </View>
                                <Text style={globalStyle.mapMenuLabel}>Groups</Text>

                            </TouchableOpacity>


                                <TouchableOpacity onPress={() => this.centerToUserMarker()}>
                                    <View style={globalStyle.mapMenuCircle} >
                                        <MaterialIcons size={25} style={{ color: '#2c3e50' }} name="my-location" />
                                        
                                </View>
                                
                                <Text style={globalStyle.mapMenuLabel} >My Location</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.fitToMap()}>
                                    <View style={globalStyle.mapMenuCircle} >
                                        <MaterialIcons size={25} style={{ color: '#2c3e50' }} name="zoom-out-map" />
                                </View>
                                <Text style={globalStyle.mapMenuLabel}>Center Map</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.changeMapMode()}>
                                    <View style={globalStyle.mapMenuCircle} >
                                        <Entypo size={25} style={{ color: '#2c3e50' }} name="globe" />
                                </View>
                                <Text style={globalStyle.mapMenuLabel}>Map Style</Text>
                            </TouchableOpacity>

                           

                           
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




                        <Modal
                        transparent={true}
                        onRequestClose={() => null}
                            visible={this.state.memberModal}>
                        <View style={globalStyle.modalWrapper}>
                            <View style={[globalStyle.modalContainer, { height: 230 }]}>
                                <Text style={globalStyle.modalHeader}>
                                        ADD MEMBER
                                </Text>
                                      
                                <Item style={globalStyle.regularitem}  >
                                    <Input style={globalStyle.textinput} name="invitationcode" autoCorrect={false}
                                         placeholder="Enter member invitation code"
                                                    value={this.state.invitationcode} maxLength={20} autoCapitalize="characters"
                                                    onChangeText={invitationcode => this.setState({ invitationcode })} />
                                            </Item>



                                            
                                    <Button disabled={!this.state.invitationcode}
                                        onPress={() => this.onSubmitCode()}
                                        bordered light full rounded style={ globalStyle.secondaryButton }>
                                        <Text style={{ color: 'white' }}>Submit</Text>
                                    </Button>
                                    <Button
                                    onPress={() => this.setState({ memberModal: false })}
                                        bordered light full rounded style={globalStyle.cancelButton}>
                                        <Text style={{ color: 'white' }}>Cancel</Text>
                                    </Button>
                               

                                    </View>
                            </View>
                        </Modal>

                        
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
  
  
  
HomePlaces = connect(mapStateToProps, { displayHomeMember, displayMember, addMember, saveLocationOffline,  saveLocation, saveLocationOnline, pushLocationOnline})(HomePlaces);
  
export default HomePlaces;