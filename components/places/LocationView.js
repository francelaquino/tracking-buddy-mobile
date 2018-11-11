
import React, { Component } from 'react';
import { StatusBar, NetInfo , TouchableOpacity,Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image,Dimensions } from 'react-native';
import { Drawer,Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch, Thumbnail,Card,Form } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, { ProviderPropType, Marker, AnimatedRegion, Animated, Polyline } from 'react-native-maps';
import { getLocationDetails } from '../../redux/actions/locationActions';
import { connect } from 'react-redux';
import Loading  from '../shared/Loading';
import Loader from '../shared/Loader';
import OfflineNotice  from '../shared/OfflineNotice';
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;




var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');


class LocationView extends Component {
    constructor(props) {
        super(props)
        this.map = null;

        this.state = {
            loading:true,
            placename:'',
            region: {
                  latitude: -37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                },
        };

      }
    

    

      

    fitToMap(){
            this.map.animateToRegion({
                latitude: this.state.region.latitude,
                longitude: this.state.region.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
              })
    }

   
    async componentDidMount() {

        setTimeout(() => {
            this.setState({
                region: {
                    longitude: this.props.navigation.state.params.location.longitude,
                    latitude: this.props.navigation.state.params.location.latitude
                },
                placename: this.props.navigation.state.params.location.address,
                dateadded: this.props.navigation.state.params.location.datemovement,
                loading: false
            })
        }, 500);
    }

    
 

   
    loading(){
        return (
          <Loading/>
        )
    }

    
    ready(){


        return (
                <ScrollView  contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}>
                   
                        <View style={styles.mainContainer}>
                            <View style={styles.mapContainer}>
                                <Image style={globalStyle.marker}
                                    source={require('../../images/placemarker.png')} />
                                <MapView ref={map => {this.map = map}}
                                    zoomEnabled = {true}
                                    onLayout = {() => this.fitToMap()} 
                                    style={StyleSheet.absoluteFill}
                                    textStyle={{ color: '#bc8b00' }}
                                    loadingEnabled={true}
                                    showsMyLocationButton={false}>

                                    <MapView.Marker  coordinate={this.state.region}>                                        

                                        <Image style={globalStyle.marker}
                                            source={require('../../images/placemarker.png')} />
                                    </MapView.Marker>
                                    </MapView>
                                    
                            </View>
                            <Content padder>
                             <View  style={styles.footerContainer}>
                             <Item stackedLabel>
                                <Label style={globalStyle.label} >Date</Label>
                                <Input numberOfLines={1}  style={globalStyle.textinput} value={this.state.dateadded} editable={false}/>
                                    </Item>
                                    <Item stackedLabel>
                                        <Label style={globalStyle.label} >Latitude</Label>
                                        <Input numberOfLines={1} style={globalStyle.textinput} value={this.state.region.latitude.toString()} editable={false} />
                                    </Item>
                                    <Item stackedLabel>
                                        <Label style={globalStyle.label} >Longitude</Label>
                                        <Input numberOfLines={1} style={globalStyle.textinput} value={this.state.region.longitude.toString()} editable={false} />
                                    </Item>
                            <Item stackedLabel style={{borderBottomWidth:0}}>
                                <Label style={globalStyle.label} >Address</Label>
                                <Input numberOfLines={2} style={globalStyle.textinput} value={this.state.placename} editable={false}/>
                            </Item>
                                </View>
                                </Content>
                            
                        </View>


                        </ScrollView  >

            
        )
    }



    render() {

        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                   
                    <Header style={globalStyle.header}>
                        <StatusBar backgroundColor="#149279" />
                            <Left style={globalStyle.headerLeft} >
                                <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                    <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />
                                </Button>
                            </Left>
                            <Body style={globalStyle.headerBody}>
                                <Title>POSITION</Title>
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
    
    mapContainer: {
        flex: 1,
        borderBottomColor:'silver',
        borderBottomWidth:.5,
        justifyContent: 'center',
        alignItems: 'center'
      
    },
    footerContainer: {
        height:290,
        
      },
  });

  


const mapStateToProps = state => ({
    details: state.fetchLocation.details,
    isLoading: state.fetchLocation.isLoading,
})

LocationView = connect(mapStateToProps, { getLocationDetails })(LocationView);

export default LocationView;




