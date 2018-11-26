
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


const advert = firebase.admob().interstitial('ca-app-pub-3378338881762914/1693535138');

const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

class LocationHistory extends Component {
    constructor(props) {
        super(props)
        this.map = null;
        this.state = {
            useruid: '',
            name:'',
            isBusy:true,
            mapMode: 'standard',
            dateFilter: Moment(new Date).format("YYYY-MM-DD").toString(),
            dateDisplay: Moment(new Date).format('MMMM DD, YYYY'),
        };

        this.setDate = this.setDate.bind(this);
    }

   

    componentWillMount() {
        this.setState({ loading:true, useruid: this.props.navigation.state.params.uid, name: this.props.navigation.state.params.name })
        
    }
    componentDidMount() {
            advert.loadAd(request.build());
            advert.on('onAdLoaded', () => {
                advert.show();
            });
           
        this.initialize();
    }

        
    initialize() {
           
        
        this.props.displayLocationsMap(this.state.useruid, this.state.dateFilter).then(res => {
            if(this.props.locationsmap.length>0){
                    this.map.animateToRegion({
                        latitude: this.props.locationsmap[0].latitude,
                        longitude: this.props.locationsmap[0].longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                    })
                    this.setState({ isBusy:false })
            }else{
                this.setState({ isBusy:false })
            }
        })
        
        

    }

    async onDateChange(date) {
        await this.setState({ isBusy: true, dateDisplay: Moment(date).format('MMMM DD, YYYY'), dateFilter: date }) 
            this.props.displayLocationsMap(this.state.useruid, this.state.dateFilter).then(res => {
                this.setState({ isBusy: false })
        })
      
    }

    fitToMap() {
        if(this.map==null){
            return false;
        }
            this.map.fitToCoordinates(this.props.locationsmap, { edgePadding: { top: 250, right: 50, bottom: 300, left: 250 }, animated: false })

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
                coordinate={marker.coordinates}
                anchor={{ x: 0.5, y: 0.5 }}
                zIndex={4}
                style={{
                    transform: [{rotate: `${marker.heading}deg`}],
                    width: 20,
                    height: 20
                  }}
               >
 <Image style={styles.marker}
                    source={require('../../images/direction.png')} />

              
               
            </MapView.Marker>

        ));
        return (
            <View style={styles.mainContainer}>
               
            <View style={styles.mapContainer}>
               
                <MapView ref={map => { this.map = map }} mapType={this.state.mapMode}
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        showsCompass={false}>
                        
                        {markers}
                
                       
                        <MapView.Polyline 
                            miterLimit={50}
                            geodesic={true}
                        style={{ zIndex: 99999 }}
                        coordinates={this.props.locationsmap}
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

                            <TouchableOpacity style={globalStyle.mapMenuCircleMap} onPress={() => this.fitToMap()} >
                                <View style={globalStyle.mapMenuCircleContainer}>
                                    <SimpleLineIcons size={23} style={{color: 'white' }} name="size-actual" />
                                </View>
                            </TouchableOpacity>
                            <Text style={globalStyle.mapMenuLabel}>Fit to Map </Text>
                            
                            
                           

                              
                             
                            </View>
                        }
                       

                    </View>
                </View>
               
               
              
            </View >

            )
    }
    
    
    setDate(newDate) {
        this.setState({ chosenDate: Moment(newDate).format('DD-MMM-YYYY')  });
    }
    

    render() {

        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                   
                    <Loader loading={this.state.isBusy} />
                    <Header style={globalStyle.header} >
                        <StatusBar backgroundColor="#149279" />
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />

                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody}>
                            <Title>LOCATION HISTORY</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}>
                        <Button transparent onPress={() => { this.props.navigation.navigate("LocationPlaces", { dateFilter: this.state.dateFilter,useruid:this.state.useruid }) }}  >
                                <Entypo size={30} style={{ color: 'white' }} name='location' />

                            </Button>
                        </Right>
                    </Header>

                    <View style={styles.mainContainer}>
               
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
                  

               {
                        this.renderMap() 
               }
               
               
           </View>

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
        
    },
    
   
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
    }

});

const mapStateToProps = state => ({
    locationsmap: state.fetchLocation.locationsmap,
  })
  
  LocationHistory = connect(mapStateToProps, {  displayLocationsMap})(LocationHistory);
  
export default LocationHistory;

