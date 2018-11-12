
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
import Slider from "react-native-slider";
import OfflineNotice from '../shared/OfflineNotice';
import { updatePlace, displayPlaces, deletePlace } from '../../redux/actions/locationActions';
import { connect } from 'react-redux';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const LATITUDE_DELTA = 0.00522;
const LONGITUDE_DELTA = Dimensions.get("window").width / Dimensions.get("window").height * LATITUDE_DELTA;




var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');


class EditCreatePlace extends Component {
    constructor(props) {
        super(props)
        this.map = null;
        this.state = {
            loading: false,
            placename: '',
            radius:200,
            address: '',
            id: '',
            mapMode: 'standard',
            region: {
                  latitude: -37.78825,
                longitude: -122.4324,
                latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA
                },
            isMapReady: false,
            pause:true,
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
            this.setState({
                region: {
                    latitude: this.props.navigation.state.params.place.latitude,
                    longitude: this.props.navigation.state.params.place.longitude,
                    latitudeDelta: this.props.navigation.state.params.place.latitudedelta,
                    longitudeDelta: this.props.navigation.state.params.place.longitudedelta,
                },
                placename:this.props.navigation.state.params.place.place,
                address: this.props.navigation.state.params.place.address,
                radius: this.props.navigation.state.params.place.radius,
                id: this.props.navigation.state.params.place.id,
                isMapReady: true,

            });
            setTimeout(() => {
                this.setState({ pause : false})
            },1500)
         
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

    onDelete() {
        this.setState({ loading: true })
        this.props.deletePlace(this.state.id).then(res => {
            if (res == true) {
                this.setState({ loading: false })
                this.props.displayPlaces();
                this.props.navigation.pop(2)
            }
        }).catch(function (err) {
            this.setState({ loading: false })
        });



    }

    onSubmit() {
        
        if (this.state.placename == "") {
            ToastAndroid.showWithGravityAndOffset("Please enter place name", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }
        
        this.setState({ loading: true })
        this.props.updatePlace(this.state.id,this.state.placename, this.state.address, this.state.region,this.state.radius).then(res => {
            this.setState({ loading: false })
            if (res == true) {
                this.setState({ placename: ''})
                this.props.displayPlaces();
                this.props.navigation.pop(2);
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
    onRegionChangeComplete = region => {
        if (this.state.pause==false) {
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
       
      
        

    }
    ready(){

      

        return (
                   
                        <View style={styles.mainContainer}>
                            
                            <ScrollView showsVerticalScrollIndicator={false}  contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                            <View style={styles.mapContainer}>
                                <MapView ref={map => { this.map = map }}
                                    zoomEnabled={true}
                                    onLayout={() => this.fitToMap()}
                                    onRegionChangeComplete={this.onRegionChangeComplete}
                                    scrollEnabled={true}
                                    style={StyleSheet.absoluteFill}
                                    textStyle={{ color: '#bc8b00' }}
                                    mapType={this.state.mapMode}
                                    loadingEnabled={true}
                                    showsMyLocationButton={true}
                                   >
                            <MapView.Circle
                                fillColor={'rgba(26, 188, 156, 0.5)'}
                                strokeColor={'rgba(20,149,123, 0.9)'}

                                center={this.state.region}
                                radius={this.state.radius / 2} />


                                </MapView>
                                
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: -40 }}>

                            <Image style={globalStyle.marker}
                                source={require('../../images/placemarker.png')} />
                        </View>
                                
                                    
                                    
                    </View>
                    <View style={[globalStyle.mapMenu, {top:50}]}>


                        <TouchableOpacity style={globalStyle.mapMenuCircleMap} onPress={() => this.changeMapMode()} >
                            <View style={globalStyle.mapMenuCircleContainer}>
                                <SimpleLineIcons size={23} style={{ color: 'white' }} name="globe" />
                            </View>
                        </TouchableOpacity>
                        <Text style={globalStyle.mapMenuLabel}>Map Style </Text>





                    </View>

                            <Content padder>
                             <View  style={styles.footerContainer}>
                             
                             <Item >
                                        <Text numberOfLines={1} style={[globalStyle.textinput, { width: '100%',height:35  }]}>{this.state.address}</Text>
                                </Item>

                               <Item stackedLabel>
                                        <Label style={globalStyle.label} >Radius <Label style={{color:'gray',fontSize:13,}}>({this.state.radius} meters)</Label></Label>
                                        <Slider style={{width:'100%',height:30}}  onValueChange={radius => this.setState({ radius })} minimumValue={100} value={this.state.radius} maximumValue={1000} step={100}  minimumTrackTintColor='#1fb28a'
            maximumTrackTintColor='#d3d3d3'
            thumbTintColor='#1a9274' value={this.state.radius} />
                                </Item>
                            
                                <Item  >
                                    <Input numberOfLines={1} style={[globalStyle.textinput, { width: '100%',height:50  }]} value={this.state.placename}
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

                            <Button
                                onPress={() => this.onDelete()}
                                bordered light full style={globalStyle.deleteButton}>
                                <Text style={{ color: 'white' }}>Delete </Text>
                            </Button>

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
                   


                    <Header style={globalStyle.header}>
                        <StatusBar backgroundColor="#149279" />
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />
                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody}>
                            <Title>{this.props.navigation.state.params.place.place}</Title>
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
        justifyContent: 'center',
        height:450,
        alignItems: 'center'
      
    },
    searchContainer: {
        height:55,
        width:'100%',
        backgroundColor:'white',
        position: 'absolute',
        zIndex: 9999,
        borderRadius: 5,
        borderWidth: 0,


    },
    footerContainer: {
        height:300,
        
      },
  });

  

  

  const mapStateToProps = state => ({
})

EditCreatePlace = connect(mapStateToProps, { displayPlaces, updatePlace, deletePlace })(EditCreatePlace);

export default EditCreatePlace;

  


  

