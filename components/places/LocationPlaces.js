
import React, { Component } from 'react';
import { StatusBar, TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, FlatList, Dimensions, Animated } from 'react-native';
import { Separator, Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, Left, Right, ListItem, Footer, FooterTab, Segment } from 'native-base';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker'
import Entypo from 'react-native-vector-icons/Entypo';
import {  displayLocationsMap } from '../../redux/actions/locationActions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker, Polyline,  PROVIDER_GOOGLE } from 'react-native-maps';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loading from '../shared/Loading';
import Loader from '../shared/Loader';
import OfflineNotice from '../shared/OfflineNotice';
import Moment from 'moment';
var userdetails = require('../shared/userDetails');
var settings = require('../../components/shared/Settings');
var globalStyle = require('../../assets/style/GlobalStyle');
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;

const LATITUDE = 27.141473
const LONGITUDE = 49.563482
const centerOffset = { x: 0.5, y: 1 };
const anchor = { x: 0.5, y: 0.1 };

var LATITUDE_DELTA = .005;
var LONGITUDE_DELTA = .005;
var cnt = 0;
var plot;
var coordinates = [];
class LocationPlaces extends Component {
    constructor(props) {
        super(props)
        this.map = null;
        this.markers = [];
        this.state = {
            useruid: '',
            name:'',
            coordinate: new MapView.AnimatedRegion({
                latitude: LATITUDE,
                longitude: LONGITUDE,
            }),
            polyline: [],
            route: [],
            index:0,
            address: '',
            datemovement: '',
            activitytype:'',
            route:'',
            pageStyle:'map',
            loading: true,
            mapMode: 'standard',
            busy: false,
            dateFilter: Moment(new Date).format("YYYY-MM-DD").toString(),
            dateDisplay: Moment(new Date).format('MMMM DD, YYYY'),
        };

        this.setDate = this.setDate.bind(this);
    }

   
    componentWillUnmount() {
        clearInterval(plot);
    }

    async componentWillMount() {
        
        await this.setState({ busy: true, useruid: this.props.navigation.state.params.uid, name: this.props.navigation.state.params.name })
        await this.initialize();
    }

        
    initialize() {
       

        this.props.displayLocationsMap(this.state.useruid, this.state.dateFilter).then(res => {
            this.setState({ loading: false, busy: false })
            setTimeout(() => {
                this.fitToMap();
                }, 100);
        })

    }

    async onDateChange(date) {
        coordinates = []
        await this.setState({ busy: true, dateDisplay: Moment(date).format('MMMM DD, YYYY'), dateFilter: date, polyline: coordinates, route:'' }) 
        this.props.displayLocationsMap(this.state.useruid, this.state.dateFilter).then(res => {
            this.setState({ busy: false })
        })
    }

    
    async changePageStyle(style) {

        await this.setState({ pageStyle: style, busy: true });
        this.props.displayLocationsMap(this.state.useruid, this.state.dateFilter).then(res => {
            this.setState({ busy: false })
            if (style == "map") {
                setTimeout(() => {
                    this.fitToMap();
                }, 100);
            } else {
                if (this.state.route == "play") {
                    clearInterval(plot);
                    this.setState({ route: '' });
                }
            }
        })
      
    }
    
    startRoute() {

        ToastAndroid.showWithGravityAndOffset("Play", ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50);
        let self = this;
        if (this.state.route == '') {
            this.setState({ polyline: coordinates})
        }
        this.setState({  route: 'play' });
            plot = setInterval(async function myTimer() {

                const coord = {
                    id: cnt,
                    coordinates: {
                        latitude: self.props.locationsmap[cnt].coordinates.latitude,
                        longitude: self.props.locationsmap[cnt].coordinates.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                }
                coordinates = coordinates.concat(coord.coordinates);

                await self.setState({ polyline: coordinates, address: self.props.locationsmap[cnt].address, datemovement: self.props.locationsmap[cnt].datemovement, activitytype: self.props.locationsmap[cnt].activitytype  })

                await self.map.animateToRegion({
                    latitude: self.props.locationsmap[cnt].coordinates.latitude,
                    longitude: self.props.locationsmap[cnt].coordinates.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                })

                cnt++;
                if (cnt >= self.props.locationsmap.length) {
                    cnt = 0;
                    clearInterval(plot);
                    coordinates = [];
                    self.setState({ route: '', address: '' });
                    ToastAndroid.showWithGravityAndOffset("End", ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50);
                }
            }, 500);
        
    }
    
    goBack() {
        this.props.navigation.goBack()
        clearInterval(plot);
        cnt = 0;
        coordinates = [];
    }
    async endRoute() {
        ToastAndroid.showWithGravityAndOffset("End", ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50);
        if (this.state.route == "play") {
            clearInterval(plot);
        }
        let self = this;
        coordinates = [];
        let i = 0;
        for (i = 0; i < this.props.locationsmap.length; i++) {

            const coord = {
                id: i,
                coordinates: {
                    latitude: self.props.locationsmap[i].coordinates.latitude,
                    longitude: self.props.locationsmap[i].coordinates.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }
            }
            coordinates = coordinates.concat(coord.coordinates);

            


        }
        
        await self.setState({ polyline: coordinates })
        cnt = 0;
        coordinates = [];
        this.setState({ route: '', address: '' });
        setTimeout(() => {
            self.fitToMap();
        }, 100);
    }

    pauseRoute() {
        ToastAndroid.showWithGravityAndOffset("Pause", ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50);
        if (this.state.route == "play") {
            clearInterval(plot);
            this.setState({ route: '' });
        }
        
    }
    loading(){
        return (
          <Loading/>
        )
    }
     

    fitToMap() {
        
        let coordinates = [];
         if (this.props.locationsmap.length == 1) {
             this.map.animateToRegion({
                 latitude: this.props.locationsmap[0].coordinates.latitude,
                 longitude: this.props.locationsmap[0].coordinates.longitude,
                 latitudeDelta: .005,
                 longitudeDelta: .005
             })

         } else if (this.props.locationsmap.length > 1) {

             for (let i = 0; i < this.props.locationsmap.length; i++) {
                 const coord = {
                     coordinates: {
                         latitude: this.props.locationsmap[i].coordinates.latitude,
                         longitude: this.props.locationsmap[i].coordinates.longitude,
                         latitudeDelta: .005,
                         longitudeDelta: .005
                     }
                 }

                 coordinates = coordinates.concat(coord.coordinates);
             }
             this.map.fitToCoordinates(coordinates, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })

        }

       


    }



    
    zoomIn() {
        if (LATITUDE_DELTA > 0) {
            LATITUDE_DELTA = LATITUDE_DELTA - .005;
            LONGITUDE_DELTA = LONGITUDE_DELTA - .005;
        }
    }
    zoomOut() {
        if (LATITUDE_DELTA < 15) {
            LATITUDE_DELTA = LATITUDE_DELTA + .005;
            LONGITUDE_DELTA = LONGITUDE_DELTA + .005;
        }
    }
    renderLocation(){
        return (
            <View style={styles.mainContainer}>
           
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                <Content padder>
                    <View style={globalStyle.container}>
                        <List>
            <FlatList
            style={{flex:1}}
                keyExtractor={item => item.id.toString()}
                                data={this.props.locationsmap}
                                    renderItem={({ item }) => (
                                        <ListItem icon key={item.id.toString()} button avatar style={globalStyle.listItem} onPress={() => { this.props.navigation.navigate("LocationDetails", { location: item }) }}>
                        <Left style={globalStyle.listLeft}>
                            <SimpleLineIcons size={30} style={{ color: '#16a085', position:'absolute',top:10, }} name='location-pin' />
                           </Left>
                    <Body style={globalStyle.listBody} >
                        <Text numberOfLines={1} style={globalStyle.listHeading}>{item.address}</Text>
                            <Text note numberOfLines={1} >{item.datemovement} / {item.activitytype}</Text>
                        </Body>
                        <Right style={globalStyle.listRight} >
                            <SimpleLineIcons style={globalStyle.listRightOptionIcon} name='arrow-right' />
                        </Right>
                </ListItem>
                ) }
            />
                        </List>


                    </View>
                </Content>
            </ScrollView></View>)
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
    renderMap() {
        const markers = this.props.locationsmap.map((marker) => (
            <MapView.Marker
                key={marker.id}
                ref={ref => { this.markers[marker.id] = ref }}
                coordinate={marker.coordinates}
                anchor={{ x: 0.5, y: 0.5 }}
                zIndex={4}
               >

                <View style={{ borderColor: '#377ab9', borderWidth: 2, backgroundColor: '#377ab9', width: 8, height: 8, borderRadius: 4, opacity:.6 }}>
                </View>
              
               
            </MapView.Marker>

        ));
        return (
            <View style={styles.mainContainer}>
               
            <View style={styles.mapContainer}>
               
                <MapView ref={map => { this.map = map }} mapType={this.state.mapMode}
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        customMapStyle={settings.retro}
                        showsCompass={false}>

                       
                        <MapView.Polyline 
                            miterLimit={50}
                            geodesic={true}
                        style={{ zIndex: 99999 }}
                        coordinates={this.state.polyline}
                        strokeWidth={3}
                            strokeColor="#1785f9"
                           />
                   
                   

                </MapView>
                    <View style={[globalStyle.mapMenu, { top: 1 }]}>
                        <TouchableOpacity onPress={() => this.changeMapMode()}>
                            <View style={globalStyle.mapMenuCircle} >
                                <Entypo size={25} style={{ color: '#2c3e50' }} name="globe" />
                            </View>
                            <Text style={globalStyle.mapMenuLabel}>Map Style</Text>
                        </TouchableOpacity>
                        
                        
                        {this.props.locationsmap.length > 1 &&
                            <View>
                                <TouchableOpacity onPress={() => this.fitToMap()}>
                                    <View style={globalStyle.mapMenuCircle} >
                                        <MaterialIcons size={25} style={{ color: '#2c3e50' }} name="zoom-out-map" />
                                    </View>
                                    <Text style={globalStyle.mapMenuLabel}>Center Map</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.zoomIn()}>
                                    <View style={globalStyle.mapMenuCircle} >
                                        <MaterialIcons size={25} style={{ color: '#2c3e50' }} name="zoom-in" />
                                    </View>
                                    <Text style={globalStyle.mapMenuLabel}>Zoom In</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.zoomOut()}>
                                    <View style={globalStyle.mapMenuCircle} >
                                        <MaterialIcons size={25} style={{ color: '#2c3e50' }} name="zoom-out" />
                                    </View>
                                    <Text style={globalStyle.mapMenuLabel}>Zoom Out</Text>
                                </TouchableOpacity>
                            </View>
                        }
                       




                    </View>
                </View>
               
               
                {this.state.address !== '' &&
                    <View style={styles.addressContainer} >
                        <View style={{ flex: 1,padding:5 }}>
                            <Text numberOfLines={1} style={{ fontSize: 13, color: 'white', marginBottom: 5 }}> {this.state.address}</Text>
                            <Text numberOfLines={1} style={{ fontSize: 13, color: 'white', }}>{this.state.datemovement} / {this.state.activitytype} </Text>
                        </View>
                    </View>
                }
                {this.props.locationsmap.length > 1 &&
                    <View style={styles.controlContainer} >

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                            {this.state.route == '' &&
                                <TouchableOpacity onPress={() => this.startRoute()} style={{ width: 60, alignItems: 'center' }}>
                                    <Image style={{ width: 35, height: 35 }}
                                        source={require('../../images/play.png')} />
                                </TouchableOpacity>
                            }
                            {this.state.route == 'play' &&
                                <TouchableOpacity onPress={() => this.pauseRoute()} style={{ width: 60, alignItems: 'center' }}>
                                    <Image style={{ width: 35, height: 35 }}
                                        source={require('../../images/pause.png')} />
                                </TouchableOpacity>
                            }
                            <TouchableOpacity onPress={() => this.endRoute()} style={{ width: 60, alignItems: 'center' }}>
                                <Image style={{ width: 35, height: 35 }}
                                    source={require('../../images/end.png')} />
                            </TouchableOpacity>
                        </View>

                    </View>
                }
            </View >

            )
    }
    async renderRoute() {
        console.log(this.props.locationsmap)
        return this.props.locationsmap.map((r) => (
            <MapView.Marker
                key={r.id}
                coordinate={r.coordinates}
            >

            </MapView.Marker>
        ));


    }
    
    setDate(newDate) {
        this.setState({ chosenDate: Moment(newDate).format('DD-MMM-YYYY')  });
    }
    ready(){
        
        return (
            <View style={styles.mainContainer}>
                <Segment style={{ backgroundColor: '#16a085' }}>
                   
                    <Button first style={{ width: 90 }} active={this.state.pageStyle == "map"} onPress={() => this.changePageStyle('map')}>
                        <Text style={{ width: 90, textAlign: 'center' }}>Route</Text>
                    </Button>
                    <Button last style={{ width: 90 }} active={this.state.pageStyle == "list"} onPress={() => this.changePageStyle('list')}>
                        <Text style={{ width: 90, textAlign: 'center' }}>List</Text>
                    </Button>
                </Segment>

                <View style={styles.searchContainer} >
                    <View style={{ height: 40, width: 50 }} >
                        <DatePicker
                            style={{}}
                            mode="date"
                            date={this.state.dateFilter}
                            confirmBtnText="Confirm"
                            hideText={true}
                            cancelBtnText="Cancel"
                            iconSource={require('../../images/today.png')}
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute', left: 0
                                }
                            }}
                            onDateChange={(date) => this.onDateChange(date)}

                        />
                    </View>
                    <View style={{ flex: 3, height: 40 }} >
                        <Text style={{ fontSize: 17, color: '#2c3e50' }}>{this.state.dateDisplay}</Text>
                        <Text style={{ fontSize: 12 }}>{this.state.name}'s Location History</Text>
                    </View>

                </View>
                <View style={{
                    height: 5, backgroundColor: '#ecf0f1', width: '100%', borderBottomWidth: 1,
                    borderBottomColor: '#efebef' }}>
                </View>

                {
                    this.state.pageStyle == 'list' ?  this.renderLocation() :
                         this.renderMap() 
                }
                
               
            </View>
        )
    }

    render() {

        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                    <OfflineNotice />
                    <Loader loading={this.state.busy} />
                    <Header style={globalStyle.header} hasSegment>
                        <StatusBar backgroundColor="#149279" />
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.goBack(); }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />

                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody}>
                            <Title>Location History</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}>
                            
                        </Right>
                    </Header>
                    {
                        this.state.loading ? this.loading() :
                            this.ready()
                    }

                </Container>
            </Root>
        )

        
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
        padding: 2,
        backgroundColor: '#1eaec5',
        alignItems: 'center',
        borderTopWidth: 0,
    },

    mapContainer: {
        flex: 1,
        display: 'flex',
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },
    marker: {

        alignSelf: 'center',
        width: 20,
        height: 20,
        margin: 0, padding: 0,
    },
    markertransparent: {
        alignSelf: 'center',
        width: 20,
        height: 20,
        margin: 0, padding: 0,
    },

    markerText: {
        textAlign: 'center',
        flex: 1,
        color: '#932424',
        fontSize: 7,
        width: 20,
        marginTop: 4,
        position: 'absolute',


    },
    searchContainer: {
        height: 50,
        width: '100%',
        backgroundColor: 'white',
        padding: 5,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor:'#efebef',
        
    },
    controlContainer: {
        height: 60,
        width: '100%',
        paddingTop: 6,
        alignItems: 'center',
        //bottom: 0,
        flexDirection: 'row',
        //position: 'absolute',
        backgroundColor: 'white',
        alignItems: 'center', padding: 5,
        borderTopWidth: 1,
        borderTopColor: '#ecf0f1',
    },
    addressContainer: {
        height: 55,
        width: '100%',
        alignItems: 'center',
        //bottom: 0,
        flexDirection: 'row',
        //position: 'absolute',
        backgroundColor: '#2ecc71',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor:'#ecf0f1',

    },

});

const mapStateToProps = state => ({
    locationslist: state.fetchLocation.locationslist,
    locationsmap: state.fetchLocation.locationsmap,
    isLoading: state.fetchLocation.isLoading,
  })
  
LocationPlaces = connect(mapStateToProps, {  displayLocationsMap})(LocationPlaces);
  
export default LocationPlaces;

