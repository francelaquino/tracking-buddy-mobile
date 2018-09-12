
import React, { Component } from 'react';
import { TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, Dimensions, Alert } from 'react-native';
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
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;



var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');


class PlaceView extends Component {
    constructor(props) {
        super(props)
        this.map = null;

        this.state = {
            id:'',
            loading:true,
            place:'',
            region: {
                  latitude: -37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                },
            mapSnapshot: '',
        };

      }
    

    

    componentWillMount() {
        this.initialize();
    }
            
    async initialize() {
       
        await this.setState({
            id:this.props.navigation.state.params.place.id,
            place:this.props.navigation.state.params.place.place,
            region:{
                latitude: this.props.navigation.state.params.place.latitude,
                longitude: this.props.navigation.state.params.place.longitude,
                latitudeDelta: this.props.navigation.state.params.place.latitudedelta,
                longitudeDelta: this.props.navigation.state.params.place.longitudedelta,
            },
           
        })
        this.props.displayMember().then(res => {
            this.setState({ loading: false })
        });
    }


 
   
    loading(){
        return (
          <Loading/>
        )
    }

    
    ready() {
        const members = this.props.members.map(member => (
            <ListItem key={member.id} avatar button style={globalStyle.listItem} onPress={() => { this.props.navigation.navigate("PlaceAlert", { place: this.state.place, placeid: this.state.id, userid: member.uid, firstname: member.firstname, region: this.state.region }) }}>
                <Left style={globalStyle.listLeft}>

                    <View style={globalStyle.listAvatarContainer} >
                        {member.emptyphoto === "1" ? <Ionicons size={46} style={{ color: '#2c3e50' }} name="ios-person" /> :
                            <Thumbnail style={globalStyle.listAvatar} source={{ uri: member.avatar }} />
                        }

                    </View>
                </Left>
                <Body style={globalStyle.listBody} >
                    <Text style={globalStyle.listHeading}>{member.firstname}</Text>
                </Body>
                <Right style={globalStyle.listRight} >
                    <SimpleLineIcons style={globalStyle.listRightOptionIcon} name='arrow-right' />
                </Right>
            </ListItem>
        ));


        return (

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                <View style={styles.mainContainer}>
                    <View style={styles.mapContainer}>
                        <Image style={globalStyle.marker}
                            source={require('../../images/placemarker.png')} />
                        <MapView ref={map => { this.map = map }}
                            zoomEnabled={true}
                            region={{ latitude: this.props.navigation.state.params.place.latitude, longitude: this.props.navigation.state.params.place.longitude, latitudeDelta: this.props.navigation.state.params.place.latitudedelta, longitudeDelta: this.props.navigation.state.params.place.latitudedelta }}
                            style={StyleSheet.absoluteFill}
                            textStyle={{ color: '#bc8b00' }}
                            loadingEnabled={true}
                            showsMyLocationButton={false}>

                            <MapView.Marker coordinate={this.state.region} >
                                <Image style={globalStyle.marker}
                                    source={require('../../images/placemarker.png')} />
                            </MapView.Marker>


                        </MapView>

                    </View>






                    <View style={styles.footerContainer}>
                        <List style={{ height: 35 }}>
                            <Separator bordered>
                                <Text style={{ height: 35, textAlignVertical: 'center' }}>Notification</Text>
                            </Separator>
                        </List>

                        <Content padder>
                            <List>
                                {members}
                            </List>

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
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />

                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody} >
                            <Title>{this.state.place}</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}  >
                            <Button transparent onPress={() => this.props.navigation.navigate("EditCreatePlace", { place: this.props.navigation.state.params.place })}>
                                <MaterialIcons size={30} style={{ color: 'white' }} name='edit' />
                            </Button>

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
        height:200,
        justifyContent: 'center',
        alignItems: 'center',
        padding:0,
      
    },

    footerContainer: {
        flex: 1,
        
      },
  });

  
  

const mapStateToProps = state => ({
    members: state.fetchMember.members,
    isLoading:state.fetchMember.isLoading,
  })
  
PlaceView=connect(mapStateToProps,{displayPlaces,updatePlace,displayMember})(PlaceView);
  
export default PlaceView;

