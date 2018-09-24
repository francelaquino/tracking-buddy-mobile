
import React, { Component } from 'react';
import { StatusBar, TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, Dimensions, Alert } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem, Left, Right, Thumbnail, Switch, Separator } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, { ProviderPropType, Marker, AnimatedRegion,Animated,Polyline } from 'react-native-maps';
import { connect } from 'react-redux';
import { updatePlace, displayPlaces  } from '../../redux/actions/locationActions' ;
import { displayMember  } from '../../redux/actions/memberActions' ;
import Loading  from '../shared/Loading';
import OfflineNotice  from '../shared/OfflineNotice';
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = 0.005;

var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');


class LocationDetails extends Component {
    constructor(props) {
        super(props)
        this.map = null;

        this.state = {
            loading:true,
            address: '',
            datemovement: '',
            activity:'',
        };

      }
    

    

      
    componentWillMount() {
        this.initialize();
    }
            
    async initialize() {
        await this.setState({
            address: this.props.navigation.state.params.location.address,
            datemovement: this.props.navigation.state.params.location.datemovement,
            activity: this.props.navigation.state.params.location.activitytype,
            loading: false,
           
        })
       //this.fitToMap();
    }


 
   
    loading(){
        return (
          <Loading/>
        )
    }

    
    ready() {
       

        return (

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                <View style={styles.mainContainer}>
                    <View style={styles.mapContainer}>
                        <Image style={[globalStyle.marker, { opacity:0 }]}
                            source={require('../../images/placemarker.png')} />
                        <MapView ref={map => { this.map = map }}
                            zoomEnabled={true}
                            region={{ latitude: this.props.navigation.state.params.location.coordinates.latitude, longitude: this.props.navigation.state.params.location.coordinates.longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }}
                            style={StyleSheet.absoluteFill}
                            textStyle={{ color: '#bc8b00' }}
                            loadingEnabled={true}
                            showsMyLocationButton={false}>

                            <MapView.Marker coordinate={{ latitude: this.props.navigation.state.params.location.coordinates.latitude, longitude: this.props.navigation.state.params.location.coordinates.longitude }} >
                                <Image style={globalStyle.marker}
                                    source={require('../../images/placemarker.png')} />
                            </MapView.Marker>


                        </MapView>

                    </View>






                    <View style={styles.footerContainer}>

                        <Content padder>
                            <Item stackedLabel>
                                <Label style={globalStyle.label} >Address</Label>
                                <Text numberOfLines={1} style={[globalStyle.textinput, { width:'100%' }]}>{this.state.address}</Text>
                            </Item>
                            
                            <Item stackedLabel>
                                <Label style={globalStyle.label} >Activity</Label>
                                <Text numberOfLines={1} style={[globalStyle.textinput, { width: '100%' }]}>{this.state.activity}</Text>
                            </Item>
                            <Item stackedLabel style={{ borderBottomWidth:0 }}>
                                <Label style={globalStyle.label} >Date/Time</Label>
                                <Text numberOfLines={1} style={[globalStyle.textinput, { width: '100%' }]}>{this.state.datemovement}</Text>
                            </Item>
                        </Content>

                    </View>

                </View>


            </ScrollView  >

        )
    }



    render() {
        


        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                    <OfflineNotice />

                    <Header style={globalStyle.header}>
                        <StatusBar backgroundColor="#149279" />
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />

                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody} >
                            <Title>Location Details</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}  >
                           
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
    map: {
        ...StyleSheet.absoluteFillObject,
        borderBottomColor:'silver',
        borderBottomWidth:.5,
      },

    mapContainer: {
        flex: 1,
        
        justifyContent: 'center',
        alignItems: 'center',
        padding:0,
      
    },

    footerContainer: {
        height: 230,
        
      },
  });

  
  

  
export default LocationDetails;

