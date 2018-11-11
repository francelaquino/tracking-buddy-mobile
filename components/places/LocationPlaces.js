
import React, { Component } from 'react';
import { StatusBar, TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, FlatList, Dimensions, Animated } from 'react-native';
import { Radio, Separator, Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, Left, Right, ListItem, Footer, FooterTab, Segment } from 'native-base';
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
import SlidingUpPanel from 'rn-sliding-up-panel';
import firebase from 'react-native-firebase';
var userdetails = require('../shared/userDetails');
var settings = require('../../components/shared/Settings');
var globalStyle = require('../../assets/style/GlobalStyle');
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;

const LATITUDE = 27.141473
const LONGITUDE = 49.563482
const centerOffset = { x: 0.5, y: 1 };
const anchor = { x: 0.5, y: 0.1 };

var LATITUDE_DELTA = .010;
var LONGITUDE_DELTA = .010;
var cnt = 0;
var plot;
var coordinates = [];

const advert = firebase.admob().interstitial('ca-app-pub-3378338881762914/1693535138');

const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

class LocationPlaces extends Component {
    constructor(props) {
        super(props)
        this.map = null;
        this.markers = [];
        this.state = {
            visible:false,
            useruid: '',
            speed: 200,
            speed_normal: false,
            speed_slow: false,
            speed_fast:true,
            addresslist: [],
            isReady:false,
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
            loading: false,
            mapMode: 'standard',
            isBusy: false,
            loadOnce:true,
            playMode:'',
            dateFilter: Moment(new Date).format("YYYY-MM-DD").toString(),
            dateDisplay: Moment(new Date).format('MMMM DD, YYYY'),
        };

        this.setDate = this.setDate.bind(this);
    }

   
    componentWillUnmount() {
        this.setState({ isReady: false })
        this.map = null;
        clearInterval(plot);
    }

    componentWillMount() {
        this.setState({ isReady:true, useruid: this.props.navigation.state.params.uid, name: this.props.navigation.state.params.name })
        
    }
    componentDidMount() {
            advert.loadAd(request.build());
            advert.on('onAdLoaded', () => {
                advert.show();
            });
           
        this.initialize();
    }

        
    initialize() {
        this.setState({ isReady:true })
        this.props.displayLocationsMap(this.state.useruid, this.state.dateFilter).then(res => {
            this.setState({ isBusy: false, addresslist: this.props.locationsmap })
            if(this.props.locationsmap.length>0){
                setTimeout(() => {
                    this.fitToMap();
                    if (this.state.loadOnce == true) {
                        ToastAndroid.showWithGravityAndOffset("Autoplay after 3 seconds", ToastAndroid.SHORT, ToastAndroid.CENTER, 25, 50);
                        this.setState({ loadOnce:false})
                    }
                    setTimeout(() => {
                        this.startRoute();
                    }, 4000);
                }, 100);
            }
        })
        
        

    }

    async onDateChange(date) {
        coordinates = []
        await this.setState({ isBusy: true, dateDisplay: Moment(date).format('MMMM DD, YYYY'), dateFilter: date, polyline: coordinates, route:'' }) 
        this.props.displayLocationsMap(this.state.useruid, this.state.dateFilter).then(res => {
            this.setState({ isBusy: false })
        })
    }

    
    async changePageStyle(style) {

        await this.setState({ pageStyle: style, isBusy: true });
        this.props.displayLocationsMap(this.state.useruid, this.state.dateFilter).then(res => {
            this.setState({ isBusy: false })
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
        let self = this;
        if (this.state.isReady == true) {
            ToastAndroid.showWithGravityAndOffset("Play", ToastAndroid.SHORT, ToastAndroid.CENTER, 25, 50);
           
            if (this.state.route == '') {
                this.setState({ polyline: coordinates })
            }
            this.setState({ route: 'play', playMode:'play' });
            plot = setInterval(async function myTimer() {
                if (self.map != null) {
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

                    await self.setState({ polyline: coordinates, address: self.props.locationsmap[cnt].address, datemovement: self.props.locationsmap[cnt].datemovement, activitytype: self.props.locationsmap[cnt].activitytype })

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
                        ToastAndroid.showWithGravityAndOffset("End", ToastAndroid.SHORT, ToastAndroid.CENTER, 25, 50);
                    }
                }
            }, this.state.speed);
        }
        
    }
    
    goBack() {
        this.props.navigation.goBack()
        clearInterval(plot);
        cnt = 0;
        coordinates = [];
    }
    async endRoute() {
        ToastAndroid.showWithGravityAndOffset("End", ToastAndroid.SHORT, ToastAndroid.CENTER, 25, 50);
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
        this.setState({ route: '', address: '', playMode:'end' });
        setTimeout(() => {
            self.fitToMap();
        }, 100);
    }

    pauseRoute() {
        ToastAndroid.showWithGravityAndOffset("Pause", ToastAndroid.SHORT, ToastAndroid.CENTER, 25, 50);
        if (this.state.route == "play") {
            clearInterval(plot);
            this.setState({ route: '', playMode:'pause' });
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
            LATITUDE_DELTA = LATITUDE_DELTA - .002;
            LONGITUDE_DELTA = LONGITUDE_DELTA - .002;
        }
    }
    zoomOut() {
        if (LATITUDE_DELTA < 15) {
            LATITUDE_DELTA = LATITUDE_DELTA + .002;
            LONGITUDE_DELTA = LONGITUDE_DELTA + .002;
        }
    }
    
    changeSpeed(speed) {
        this.setState({ speed })
        console.log(speed)
        this.setState({ speed_fast: false, speed_normal: false, speed_slow:false})
        if (speed == 200) {
            this.setState({ speed_fast:true })
        } else if (speed == 1000) {
            this.setState({ speed_normal: true })
        } else if (speed == 3000) {
            this.setState({ speed_slow: true })
        }
    }
    showSpeedWindow() {
        this.setState({ visible: true })
        this.endRoute();
    }
    searchFilterFunction = text => {
        if (text != "") {
            this.setState({ addresslist: [] })
            let address = this.props.locationsmap.filter((item) => {
                return item.address.includes(text)
            });


            this.setState({ addresslist: [...address] })


        } else {
            this.setState({ addresslist: this.props.locationsmap })
        }

    };

    renderLocation(){
        return (
            <View style={styles.mainContainer}>
                <Header style={{ backgroundColor:'#ecf0f1'}} searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" onChangeText={text => this.searchFilterFunction(text)} />
                    </Item>
                </Header>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                <Content padder>
                    <View style={globalStyle.container}>
                        <List>
            <FlatList
            style={{flex:1}}
                keyExtractor={item => item.id.toString()}
                                    data={this.state.addresslist}
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
                       
                        
                        {this.props.locationsmap.length > 1 &&
                            <View>
                            <TouchableOpacity onPress={() => this.changeMapMode()} style={globalStyle.mapMenuCircleMap}>
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{ color: 'white' }} name="globe" />
                                </View>
                            </TouchableOpacity>
                            <Text style={globalStyle.mapMenuLabel}>Map Style </Text>



                            <Text style={globalStyle.mapMenuLabel}>Zoom In </Text>
                            <TouchableOpacity onPress={() => this.showSpeedWindow()} style={globalStyle.mapMenuCircleMap}>
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{ color: 'white' }} name="graph" />
                                </View>
                            </TouchableOpacity>
                            <Text style={globalStyle.mapMenuLabel}>Change Speed </Text>
                                <TouchableOpacity onPress={() => this.fitToMap()} style={globalStyle.mapMenuCircleMap} >
                                    <View style={globalStyle.mapMenuCircleContainer}>
                                        <SimpleLineIcons size={23} style={{ color: 'white' }} name="size-actual" />
                                    </View>
                            </TouchableOpacity>
                            <Text style={globalStyle.mapMenuLabel}>Fit to Map </Text>

                                <TouchableOpacity onPress={() => this.zoomIn()} style={globalStyle.mapMenuCircleMap}>
                                    <View style={globalStyle.mapMenuCircleContainer}>
                                        <SimpleLineIcons size={23} style={{ color: 'white' }} name="magnifier-add" />
                                    </View>
                            </TouchableOpacity>
                            <Text style={globalStyle.mapMenuLabel}>Zoom In </Text>
                                <TouchableOpacity onPress={() => this.zoomOut()} style={globalStyle.mapMenuCircleMap}>
                                    <View style={globalStyle.mapMenuCircleContainer}>
                                        <SimpleLineIcons size={23} style={{ color: 'white' }} name="magnifier-remove" />
                                    </View>
                            </TouchableOpacity>
                            <Text style={globalStyle.mapMenuLabel}>Zoom Out </Text>
                            </View>
                        }
                       

                    </View>
                </View>
               
               
                
                {this.state.playMode != ''  &&
                    <View style={styles.controlContainer} >

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        {this.state.route == '' &&
                            <View>
                            <TouchableOpacity onPress={() => this.startRoute()} style={globalStyle.mapMenuCircleControl} >
                                    <View style={globalStyle.mapMenuCircleContainer}>
                                        <SimpleLineIcons size={20} style={{ color: 'white' }} name="control-play" />
                                    </View>
                            </TouchableOpacity>
                            <Text style={[globalStyle.mapMenuLabel, { fontSize:13 }]}>Play </Text>
                            </View>
                        }
                        {this.state.route == 'play' &&
                            <View>
                            <TouchableOpacity onPress={() => this.pauseRoute()} style={globalStyle.mapMenuCircleControl} >
                                    <View style={globalStyle.mapMenuCircleContainer}>
                                        <SimpleLineIcons size={20} style={{ color: 'white' }} name="control-pause" />
                                    </View>
                                </TouchableOpacity>
                            <Text style={[globalStyle.mapMenuLabel, { fontSize: 13 }]}>Pause </Text>
                            </View>
                        }
                        <View>
                            <TouchableOpacity onPress={() => this.endRoute()} style={globalStyle.mapMenuCircleControl} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                <SimpleLineIcons size={20} style={{ color: 'white' }} name="control-end" />
                                </View>
                            </TouchableOpacity>
                            <Text style={[globalStyle.mapMenuLabel, { fontSize: 13 }]}>End </Text>

                            </View>

                           
                        </View>

                    </View>
                }
            </View >

            )
    }
    async renderRoute() {
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
                        <Text style={{ fontSize: 15, color: '#2c3e50' }}>{this.state.dateDisplay}</Text>
                        <Text style={{ fontSize: 15 }}>{this.state.name}'s Location History</Text>
                    </View>

                </View>
                {this.state.pageStyle == 'map' &&
                    <View style={{
                        height: 5, backgroundColor: '#ecf0f1', width: '100%', borderBottomWidth: 1,
                        borderBottomColor: '#efebef'
                    }}>
                    </View>
                }

                {
                    this.state.pageStyle == 'list' ?  this.renderLocation() :
                         this.renderMap() 
                }
                
                <SlidingUpPanel
                    allowDragging={false}
                    visible={this.state.visible}
                    onRequestClose={() => this.setState({ visible: false })}>
                    <View style={styles.container}>
                        <Content padder>
                            <ListItem button onPress={() => this.changeSpeed( 200)}>
                                <Left>
                                    <Text>Fast</Text>
                                </Left>
                                <Right>
                                    <Radio selected={this.state.speed_fast} />
                                </Right>
                            </ListItem>
                            <ListItem button onPress={() => this.changeSpeed( 1000)}>
                                <Left>
                                    <Text>Normal</Text>
                                </Left>
                                <Right>
                                    <Radio selected={this.state.speed_normal} />
                                </Right>
                            </ListItem>
                            <ListItem button onPress={() => this.changeSpeed( 3000)} >
                                <Left>
                                    <Text>Slow</Text>
                                </Left>
                                <Right >
                                    <Radio selected={this.state.speed_slow} />
                                </Right>
                            </ListItem>
                            

                       

                        

                        <Item style={{ borderBottomWidth: 0 }}>
                           
                            <Button
                                onPress={() => this.setState({ visible: false })}
                                bordered light full style={globalStyle.secondaryButton}>
                                <Text style={{ color: 'white' }}>Close</Text>
                            </Button>
                        </Item>
                        </Content>
                    </View>
                </SlidingUpPanel>
            </View>
        )
    }

    render() {

        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                   
                    <Loader loading={this.state.isBusy} />
                    <Header style={globalStyle.header} hasSegment>
                        <StatusBar backgroundColor="#149279" />
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.goBack(); }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />

                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody}>
                            <Title>LOCATION HISTORY</Title>
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
        height: 75,
        width: '100%',
        position: 'absolute',
        bottom:5,
        alignItems: 'center',
        //bottom: 0,
        backgroundColor: 'transparent',
        alignItems: 'center'
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
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
    }

});

const mapStateToProps = state => ({
    locationslist: state.fetchLocation.locationslist,
    locationsmap: state.fetchLocation.locationsmap,
    isLoading: state.fetchLocation.isLoading,
  })
  
LocationPlaces = connect(mapStateToProps, {  displayLocationsMap})(LocationPlaces);
  
export default LocationPlaces;

