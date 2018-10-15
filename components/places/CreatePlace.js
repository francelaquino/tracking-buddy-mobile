
import React, { Component } from 'react';
import { StatusBar, NetInfo, TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, Dimensions, Modal, TouchableHighlight } from 'react-native';
import { Drawer,Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch, Thumbnail,Card,Form } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import MapView, { ProviderPropType, Marker, AnimatedRegion, Animated, Polyline } from 'react-native-maps';
import Loading  from '../shared/Loading';
import Loader from '../shared/Loader';
import { savePlace, displayPlaces } from '../../redux/actions/locationActions';
import { connect } from 'react-redux';
import OfflineNotice from '../shared/OfflineNotice';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Slider from "react-native-slider";
const LATITUDE_DELTA = 0.00522;
const LONGITUDE_DELTA = Dimensions.get("window").width / Dimensions.get("window").height * LATITUDE_DELTA;




var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');


class CreatePlace extends Component {
    constructor(props) {
        super(props)
        this.map = null;
        this.state = {
            loading: false,
            modalVisible: false,
            radius: 200,
            mapMode: 'standard',
            placename: '',
            address: '',
            region: {
                  latitude: -37.78825,
                longitude: -122.4324,
                latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA
                },
            isMapReady: false,
        };

      }
    

    

    fitToMap() {
       
        setTimeout(() => {
            try {
                this.map.animateToRegion({
                    latitude: this.state.region.latitude,
                    longitude: this.state.region.longitude,
                    latitudeDelta: this.state.region.latitudeDelta,
                    longitudeDelta: this.state.region.longitudeDelta
                })
            } catch(e) {

            }
            }, 0);
        
           

    }

 
   
     componentDidMount(){
         this.getCurrentPosition();


    }





    getCurrentPosition() {
        try {
          navigator.geolocation.getCurrentPosition(
              async (position) => {
              const region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              };
              this.setState({region:{
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
              },
                  

                 
                  })
                  let coords = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
              };
                  let self = this;
                  await axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&sensor=false&key=AIzaSyCHZ-obEHL8TTP4_8vPfQKAyzvRrrlmi5Q")
                      .then(async function (res) {
                          if (res.data.results.length > 0) {
                              self.setState({
                                  address: res.data.results[0].formatted_address,
                                  isMapReady: true,
                              });
                          }


                      }).catch(function (error) {
                      });
                 

            },
            (error) => {
              },
                { enableHighAccuracy: false, timeout: 10000 }

          );
        } catch(e) {
        }
    }

   
    loading(){
        return (
          <Loading/>
        )
    }

  
    updateLocation(details) {
            this.setState({
                address: details.formatted_address,
                region: {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }
            });

            
        
         
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

    onSubmit() {
        
        if (this.state.placename == "") {
            ToastAndroid.showWithGravityAndOffset("Please enter place name", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }
        
        this.setState({ loading: true })
        this.props.savePlace(this.state.placename, this.state.address, this.state.region,this.state.radius).then(res => {
            this.setState({ loading: false })
            if (res == true) {
                this.setState({ placename: ''})
                this.props.displayPlaces();
                this.props.navigation.pop(1);
            }

        });
    }
   
    onRegionChangeComplete = region => {
        let self = this;
       
        axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + region.latitude + "," + region.longitude + "&sensor=false&key=AIzaSyCHZ-obEHL8TTP4_8vPfQKAyzvRrrlmi5Q")
            .then(async function (res) {
                if (res.data.results.length > 0) {
                    self.setState({
                        address: res.data.results[0].formatted_address,
                        region: {
                            latitude: region.latitude,
                            longitude: region.longitude,
                            latitudeDelta: region.latitudeDelta,
                            longitudeDelta: region.longitudeDelta
                        }
                    });
                }


            }).catch(function (error) {
            });

       
       
      
        

    }



    ready(){

        //const { region } = this.state;

        return (
                    
                <View style={styles.mainContainer}>
                   
                    <View style={styles.searchContainer}>
                        
                                <GooglePlacesAutocomplete
                                    ref={c => this.googlePlacesAutocomplete = c}

                                    placeholder='Search Location'
                                    minLength={2} // minimum length of text to search
                                    autoFocus={false}
                                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                    listViewDisplayed='auto'    // true/false/undefined
                                    fetchDetails={true}
                                    renderDescription={row => row.description} // custom description render
                                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                       
                                        this.updateLocation(details);
                                        this.googlePlacesAutocomplete._handleChangeText('')
                                       
                                    }}
                                   
                                    getDefaultValue={() => ''}

                                    query={{
                                        // available options: https://developers.google.com/places/web-service/autocomplete
                                        key: 'AIzaSyCHZ-obEHL8TTP4_8vPfQKAyzvRrrlmi5Q',
                                        language: 'en', // language of the results
                                    }}

                                    styles={{
                                        textInputContainer: {
                                            width: '100%',
                                            height: 56,
                                            backgroundColor: '#16a085',
                                            borderBottomWidth:0,
                                            
                                        },
                                        textInput: {
                                            height:40,
                                        },
                                        description: {
                                            color:'black'
                                        },
                                    }}
                                    
                                    currentLocation={false} 
                                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                    GoogleReverseGeocodingQuery={{
                                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                                    }}
                                    GooglePlacesSearchQuery={{
                                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                        rankby: 'distance',
                                        types: 'food'
                                    }}

                                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

                                    debounce={200}
                                    renderRightButton={() => <Feather onPress={() => { this.googlePlacesAutocomplete._handleChangeText('') }} size={25} style={{ color: 'white', height: 30, marginTop: 13, marginRight: 15 }} name='delete' />}
                                />
                                
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                            <View style={styles.mapContainer}>
                                <MapView ref={map => { this.map = map }}
                                    zoomEnabled={true}
                                    onLayout={() => this.fitToMap()}
                            onRegionChangeComplete={this.onRegionChangeComplete}
                            mapType={this.state.mapMode}
                                    scrollEnabled={true}
                                    style={StyleSheet.absoluteFill}
                                    textStyle={{ color: '#bc8b00' }}
                            loadingEnabled={true}
                            
                                    showsMyLocationButton={true}
                        >
                            <MapView.Circle
                                fillColor={'rgba(26, 188, 156, 0.5)'}
                                strokeColor={'rgba(20,149,123, 0.9)'}
                                
                                center={this.state.region}
                                radius={this.state.radius/2} />
                           
                                </MapView>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: -40 }}>
                            
                            <Image style={globalStyle.marker}
                                source={require('../../images/placemarker.png')} />
                        </View>
                               
                                
                                    
                                    
                    </View>
                    <View style={[globalStyle.mapMenu, { top: 50 }]}>


                        <TouchableOpacity style={globalStyle.mapMenuCircleMap} onPress={() => this.changeMapMode()} >
                            <View style={globalStyle.mapMenuCircleContainer}>
                                <SimpleLineIcons size={23} style={{ color: 'white' }} name="globe" />
                            </View>
                        </TouchableOpacity>
                        <Text style={globalStyle.mapMenuLabel}>Map Style </Text>





                    </View>
                           <Content padder>
                             <View  style={styles.footerContainer}>
                             
                             <Item stackedLabel>
                             <Label style={globalStyle.label} >Address </Label>
                                        <Text numberOfLines={1} style={[globalStyle.textinput, { width: '100%',height:35 }]}>{this.state.address}</Text>
                                </Item>

                               <Item stackedLabel>
                                        <Label style={globalStyle.label} >Radius <Label style={{color:'gray',fontSize:13,}}>({this.state.radius} meters)</Label></Label>
                                        <Slider style={{width:'100%',height:30}}  onValueChange={radius => this.setState({ radius })} minimumValue={100} value={this.state.radius} maximumValue={1000} step={100}  minimumTrackTintColor='#1fb28a'
            maximumTrackTintColor='#d3d3d3'
            thumbTintColor='#1a9274' value={this.state.radius} />
                                </Item>
                            
                                <Item  >
                                    <Input numberOfLines={1} style={[globalStyle.textinput,{height:50}]} value={this.state.placename}
                                        value={this.state.placename} maxLength={50} placeholder="Enter place name"
                                        onChangeText={placename => this.setState({ placename })}/>
                                   
                                </Item>

                                <Item  style={{ borderBottomWidth: 0 }}>
                                    <Button
                                            onPress={() => this.onSubmit()}
                                        bordered light full style={globalStyle.secondaryButton}>
                                        <Text style={{ color: 'white' }}>Save</Text>
                                    </Button>
                                </Item>

                                </View>
                               </Content>
                                </ScrollView  >
                        </View>


                
            
        )
    }



    render() {

        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                    <Loader loading={this.state.loading} />
                    <OfflineNotice />


                    <Header style={globalStyle.header}>
                        <StatusBar backgroundColor="#149279" />
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />
                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody}>
                            <Title>ADD PLACE</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}>
                        </Right>
                    </Header>
                    {
                        !this.state.isMapReady ? this.loading() :
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
    
    mapContainer: {
        //flex: 2,
        justifyContent: 'center',
        height:450,
        alignItems: 'center'
      
    },
    searchContainer: {
        //flex: 1,
        //flexDirection: 'row',
        height:55,
        width:'100%',
        backgroundColor:'white',
        position: 'absolute',
        zIndex: 9999,
        borderRadius: 5,
        borderWidth: 0,
        


    },
    footerContainer: {
        height:250,
    
        
      },
  });

  


  const mapStateToProps = state => ({
})

CreatePlace = connect(mapStateToProps, { displayPlaces, savePlace })(CreatePlace);

export default CreatePlace;

  

